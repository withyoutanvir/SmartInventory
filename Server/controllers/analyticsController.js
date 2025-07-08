import Bill from '../models/Bill.js';


export const getTopSKUs = async (req, res) => {
  try {
    const pipeline = [
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.sku',
          totalQty: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ];

    const result = await Bill.aggregate(pipeline);
    res.status(200).json(result);
  } catch (err) {
    console.error('Top SKUs error:', err.message);
    res.status(500).json({ error: 'Failed to fetch top SKUs' });
  }
};


export const getDailySales = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          total: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const result = await Bill.aggregate(pipeline);
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
      revenueGrowth: '+12%' // Optional static value
    });
  } catch (err) {
    console.error('Summary error:', err.message);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};

export const getAnalyticsCombined = async (req, res) => {
  try {
    // Summary part
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

    // Trend data
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
