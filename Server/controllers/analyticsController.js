import fs from 'fs';
import pkg from 'papaparse';
const { parse } = pkg;

import Bill from '../models/Bill.js';

export const getTopSKUs = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.sku',
          totalQty: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);
    res.status(200).json(result);
  } catch (err) {
    console.error('Top SKUs error:', err.message);
    res.status(500).json({ error: 'Failed to fetch top SKUs' });
  }
};

export const getDailySales = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          total: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = result.map(entry => ({
      date: entry._id,
      total: entry.total
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Daily sales error:', err.message);
    res.status(500).json({ error: 'Failed to fetch daily sales' });
  }
};

export const getSummary = async (req, res) => {
  try {
    const totalSalesAgg = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    const ordersCount = await Bill.countDocuments();

    const topSKU = await Bill.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.sku',
          qty: { $sum: '$items.quantity' }
        }
      },
      { $sort: { qty: -1 } },
      { $limit: 1 }
    ]);

    res.status(200).json({
      revenue: totalSales,
      orders: ordersCount,
      topProduct: topSKU[0]?._id || 'N/A',
      revenueGrowth: '+12%' 
    });
  } catch (err) {
    console.error('Summary error:', err.message);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};

export const getAnalyticsCombined = async (req, res) => {
  try {
    const totalSalesAgg = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;
    const ordersCount = await Bill.countDocuments();

    const topSKU = await Bill.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.sku',
          qty: { $sum: '$items.quantity' }
        }
      },
      { $sort: { qty: -1 } },
      { $limit: 1 }
    ]);

    const summary = {
      revenue: totalSales,
      orders: ordersCount,
      topProduct: topSKU[0]?._id || 'N/A',
      revenueGrowth: '+12%'
    };

    const trendRaw = await Bill.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          total: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const trend = trendRaw.map(entry => ({
      date: entry._id,
      total: entry.total
    }));

    res.status(200).json({ summary, trend });
  } catch (err) {
    console.error('Combined analytics error:', err.message);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export const uploadCSVAndParse = async (req, res) => {
  try {
    const csvContent = req.file?.buffer?.toString('utf8');
    if (!csvContent) {
      return res.status(400).json({ error: "❌ CSV file required." });
    }

    const results = parse(csvContent, {
      header: true,
      skipEmptyLines: true
    });

    const grouped = {};
    let validCount = 0;

    results.data.forEach((row) => {
      const date = row.date;
      const sku = row.sku;
      const quantity = parseInt(row.quantity);
      const price = parseFloat(row.price);

      const isValidDate = date && !isNaN(Date.parse(date));
      const isValidQuantity = !isNaN(quantity) && quantity > 0;
      const isValidPrice = !isNaN(price) && price > 0;

      if (isValidDate && sku && isValidQuantity && isValidPrice) {
        const total = price * quantity;
        grouped[date] = (grouped[date] || 0) + total;
        validCount++;
      }
    });

    if (validCount === 0) {
      return res.status(400).json({ error: "❌ All rows invalid. Nothing inserted." });
    }

    const parsedData = Object.entries(grouped).map(([date, total]) => ({
      date,
      total,
    }));

    return res.status(200).json({ trend: parsedData });
  } catch (err) {
    console.error("CSV upload error:", err.message);
    return res.status(500).json({ error: "CSV processing failed", details: err.message });
  }
};
