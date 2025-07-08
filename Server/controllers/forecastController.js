import axios from 'axios';
import Bill from '../models/Bill.js';
import Product from "../models/product.js";

export const getForecast = async (req, res) => {
  try {
    const { sku, days } = req.query;
    const response = await axios.get(`http://localhost:8000/predict?sku=${sku}&days=${days}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Forecast service failed' });
  }
};


export const getReorderSuggestions = async (req, res) => {
  try {
    // Get all sold quantities per SKU from the bills
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

    // Get all products
    const products = await Product.find();

    // Build reorder list
    const reorder = products
      .filter(p => (soldMap[p.sku] || 0) > p.min_stock_level)
      .map(p => ({
        sku: p.sku,
        name: p.name,
        sold: soldMap[p.sku] || 0,
        threshold: p.min_stock_level
      }));

    res.json({ reorder });
  } catch (err) {
    console.error("Error generating reorder suggestions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

