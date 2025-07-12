import axios from 'axios';
import Bill from '../models/Bill.js';
import Product from '../models/product.js';

// 🔮 GET /api/forecast?sku=SKU004&days=7
export const getForecast = async (req, res) => {
  try {
    const { sku, days } = req.query;

    if (!sku || !days) {
      return res.status(400).json({ error: "Missing 'sku' or 'days' parameter" });
    }

    // 1. Call the ML microservice
    const forecastRes = await axios.get(`http://localhost:8000/predict?sku=${sku}&days=${days}`);
    const { forecast } = forecastRes.data; // From ML service: [{ ds, yhat }, ...]

    // 2. Get actual sales data for the same SKU
    const actualSales = await Bill.aggregate([
      { $unwind: "$items" },
      { $match: { "items.sku": sku } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
          },
          total: { $sum: "$items.quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          total: 1
        }
      }
    ]);

    // 3. Map actual sales by date
    const actualMap = {};
    actualSales.forEach(entry => {
      actualMap[entry.date] = entry.total;
    });

    // 4. Merge forecast + actual into chart data
    const combined = forecast.map(point => ({
      date: point.ds,
      predicted: Math.round(point.yhat),
      actual: actualMap[point.ds] || 0
    }));

    res.status(200).json(combined);
  } catch (err) {
    console.error("❌ Forecast fetch error:", err.message);
    res.status(500).json({ error: "Forecast service failed" });
  }
};

// 📦 GET /api/forecast/reorder
export const getReorderSuggestions = async (req, res) => {
  try {
    // 1. Aggregate total sold per SKU
    const sold = await Bill.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.sku",
          totalSold: { $sum: "$items.quantity" }
        }
      }
    ]);

    const soldMap = {};
    sold.forEach(item => {
      soldMap[item._id] = item.totalSold;
    });

    // 2. Get product info
    const products = await Product.find();

    // 3. Identify reorder needs
    const reorder = products
      .filter(p => (soldMap[p.sku] || 0) > p.min_stock_level)
      .map(p => ({
        sku: p.sku,
        name: p.name,
        currentStock: p.stock,
        forecastedDemand: soldMap[p.sku] || 0,
        reorderQty: Math.max((soldMap[p.sku] || 0) - p.stock, 0)
      }));

    res.status(200).json({ reorder });
  } catch (err) {
    console.error("❌ Reorder suggestion error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
