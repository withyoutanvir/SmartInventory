import Bill from '../models/Bill.js';
import path from 'path';
import fs from 'fs';
import parseCSV from '../utils/parseCSV.js';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Save uploaded CSV to /data
const storeCSVFile = async (file) => {
  const filePath = path.join(__dirname, '../data/sales.csv');
  await file.mv(filePath); // Overwrites existing file
  return filePath;
};

// Upload CSV and insert validated bills
export const uploadCSV = async (req, res) => {
  try {
    if (!req.files?.csvFile) {
      return res.status(400).json({ error: '❌ CSV file required.' });
    }

    const filePath = await storeCSVFile(req.files.csvFile);
    const parsedData = await parseCSV(filePath);

    const validData = [];
    let skipped = 0;

    for (const row of parsedData) {
      const { date, sku, quantity, price } = row;

      if (!date || !sku || !quantity || !price) {
        console.warn('⚠️ Missing fields:', row);
        skipped++;
        continue;
      }

      const parsedDate = new Date(date);
      const qty = parseInt(quantity);
      const prc = parseFloat(price);

      if (isNaN(parsedDate.getTime()) || isNaN(qty) || isNaN(prc)) {
        console.warn('⚠️ Invalid types:', row);
        skipped++;
        continue;
      }

      validData.push({
        timestamp: parsedDate,
        total: prc * qty,
        items: [{
          sku,
          quantity: qty,
          price: prc
        }]
      });
    }

    if (validData.length === 0) {
      return res.status(400).json({ error: '❌ All rows invalid. Nothing inserted.' });
    }

    await Bill.insertMany(validData);

    
    try {
      await axios.get('http://localhost:8000/train');
    } catch (trainErr) {
      console.warn('⚠️ FastAPI unreachable:', trainErr.message);
    }

    res.status(201).json({
      message: '✅ CSV uploaded and stored.',
      inserted: validData.length,
      skipped
    });

  } catch (error) {
    console.error('❌ Upload Error:', error.message);
    res.status(500).json({ error: 'Failed to process CSV.' });
  }
};

// Get 5 most recent sales
export const getRecentSales = async (req, res) => {
  try {
    const recentBills = await Bill.find().sort({ timestamp: -1 }).limit(5);
    res.json(recentBills);
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all sales with optional filters
export const getSalesData = async (req, res) => {
  try {
    const filter = {};
    if (req.query.sku) filter['items.sku'] = req.query.sku;
    if (req.query.startDate && req.query.endDate) {
      filter.timestamp = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const sales = await Bill.find(filter).sort({ timestamp: 1 });
    res.status(200).json(sales);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
};

// Get unique SKUs from all bills
export const getSKUList = async (req, res) => {
  try {
    const skus = await Bill.distinct('items.sku');
    res.status(200).json(skus);
  } catch (error) {
    console.error("❌ SKU Fetch Error:", error);
    res.status(500).json({ error: 'Failed to fetch SKUs' });
  }
};

// Delete all bills
export const deleteAllBills = async (req, res) => {
  try {
    await Bill.deleteMany({});
    res.status(200).json({ message: '🗑️ All billing data deleted' });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ error: 'Failed to delete billing data' });
  }
};
