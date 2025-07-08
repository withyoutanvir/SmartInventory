from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from prophet import Prophet
import joblib
import os
from pydantic import BaseModel
from typing import List
import uvicorn

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File paths
MODEL_PATH = "saved_model/prophet_model.pkl"
DATA_PATH = "data/sales.csv"

# Load existing model if available
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print("✅ Model loaded successfully.")
    except Exception as e:
        print(f"⚠️ Failed to load existing model: {e}")
        model = None

def save_model(model):
    os.makedirs("saved_model", exist_ok=True)
    joblib.dump(model, MODEL_PATH)

@app.get("/")
def root():
    return {"message": "✅ AI microservice is running"}

@app.get("/train")
def train():
    try:
        df = pd.read_csv(DATA_PATH)

        # Step 1: Drop rows with missing or invalid fields
        df = df.dropna(subset=['date', 'quantity'])

        # Step 2: Ensure quantity is numeric
        df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce')

        # Step 3: Drop rows with invalid numeric values
        df = df.dropna(subset=['quantity'])

        # Step 4: Group by date and prepare for Prophet
        df_grouped = df.groupby('date').agg({'quantity': 'sum'}).reset_index()
        df_grouped.rename(columns={'date': 'ds', 'quantity': 'y'}, inplace=True)

        # Step 5: Parse dates safely
        df_grouped['ds'] = pd.to_datetime(df_grouped['ds'], errors='coerce')
        df_grouped = df_grouped.dropna(subset=['ds'])

        if df_grouped.empty:
            raise HTTPException(status_code=400, detail="No valid rows to train the model.")

        # Train model
        new_model = Prophet()
        new_model.fit(df_grouped)

        save_model(new_model)
        global model
        model = new_model

        return {"message": "✅ Model trained and saved", "rows_used": len(df_grouped)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@app.get("/predict")
def predict(sku: str = Query(...), days: int = Query(7)):
    if not model:
        raise HTTPException(status_code=503, detail="⚠️ Model not trained yet.")

    future = model.make_future_dataframe(periods=days)
    forecast = model.predict(future)
    result = forecast[['ds', 'yhat']].tail(days).to_dict(orient='records')

    return {
        "sku": sku,
        "forecast": result
    }

class StockRequest(BaseModel):
    sku: str
    current_stock: int
    days: int = 7

@app.post("/reorder")
def reorder(data: StockRequest):
    if not model:
        raise HTTPException(status_code=503, detail="⚠️ Model not trained yet.")

    future = model.make_future_dataframe(periods=data.days)
    forecast = model.predict(future)
    total_forecast = forecast[['yhat']].tail(data.days)['yhat'].sum()

    recommended_qty = max(0, round(total_forecast - data.current_stock))
    return {
        "sku": data.sku,
        "recommended_restock_qty": recommended_qty
    }

@app.get("/forecast_accuracy")
def forecast_accuracy():
    if not model:
        raise HTTPException(status_code=503, detail="⚠️ Model not trained.")

    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=['date', 'quantity'])
    df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce')
    df = df.dropna(subset=['quantity'])

    df_grouped = df.groupby('date').agg({'quantity': 'sum'}).reset_index()
    df_grouped.rename(columns={'date': 'ds', 'quantity': 'y'}, inplace=True)
    df_grouped['ds'] = pd.to_datetime(df_grouped['ds'], errors='coerce')
    df_grouped = df_grouped.dropna(subset=['ds'])

    if df_grouped.empty:
        raise HTTPException(status_code=400, detail="No valid data for accuracy calculation.")

    forecast = model.predict(df_grouped[['ds']])
    merged = pd.merge(df_grouped, forecast[['ds', 'yhat']], on='ds')
    merged['error'] = abs(merged['y'] - merged['yhat'])
    mape = (merged['error'] / merged['y']).replace([float('inf'), -float('inf')], 0).mean() * 100
    accuracy = max(0, 100 - mape)

    return {"forecast_accuracy_percent": round(accuracy, 2)}

# Optional CLI support
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--train", action="store_true", help="Train the model from CSV")
    args = parser.parse_args()

    if args.train:
        train()
    else:
        uvicorn.run(app, host="0.0.0.0", port=8000)
