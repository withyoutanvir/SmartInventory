# SmartInventory

 # 🧠 Smart Inventory - AI-Powered Store-Level Inventory Management

Smart Inventory is an intelligent, real-time inventory and analytics system designed to empower retail stores with precise demand forecasting, smart restocking suggestions, and deep store-level analytics. Unlike traditional systems used by companies like Walmart, our solution focuses on automation, predictive AI, and operational visibility at the **individual store level**.

## 🚀 Why Smart Inventory?

Current inventory systems in retail giants like Walmart or Amazon often:

- Lack **real-time adaptability** at the store level
- Are **centralized**, making local store analytics slow
- Require **manual effort** for stock predictions and reorders

**Smart Inventory** solves these problems with:

- AI-based demand forecasting
- Instant low-stock alerts
- Dynamic dashboards per store
- Smart suggestions for product placement and restocking

---

## 🚀 Live Demo

🔗 [Click here to try Smart Inventory](https://smartinventory0.netlify.app/)

## 🧩 Features

✅ Real-time inventory tracking  
✅ Predictive analytics using historical data  
✅ Smart restocking & supplier alerts  
✅ Store-wise dashboard for product performance  
✅ Inventory health checker  
✅ Automated reorder triggers  
✅ Admin panel for management  
✅ API for mobile/POS system integration  

---

## 🏗️ Tech Stack

| Layer       | Technology                   |
|------------|------------------------------|
| Frontend   | React.js + Tailwind CSS      |
| Backend    | Node.js + Express.js         |
| Database   | MongoDB                      |
| AI Layer   | Python (scikit-learn / XGBoost)  
| Messaging  | Email / SMS using Twilio/SendGrid  
| Auth       | JWT + Role-based Access      |
| Deployment | Render / Vercel / MongoDB Atlas |

---

## 📊 System Architecture

<pre>
└──> Frontend (React.js)
└──> Backend API (Node.js + Express)
├── Inventory CRUD
├── AI Prediction Service (Python)
├── Alert Service
└── Auth Middleware
└── MongoDB
</pre>


- The AI service runs as a microservice, consuming inventory data to predict stockouts.
- APIs allow both frontend dashboard & external clients (POS, Mobile App) to interact.

---

## 🧠 AI/ML Functionality

The AI model predicts product demand using:

- Historical sales data
- Seasonality & trends
- External factors (optional: promotions, weather, etc.)

Model: prophet

Outputs:

- Dashboard Showcasing future prediction.
- Total Sales, trending SKU

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/smart-inventory.git
cd smart-inventory
cd backend
npm install
touch .env
---
## Add this to your env
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
PORT=5000
## Start Command
npm start

## Front-end Setup
cd frontend
npm install
npm run dev

##  AI Microservice

cd ai_microservice
pip install -r requirements.txt
python model_server.py
---

