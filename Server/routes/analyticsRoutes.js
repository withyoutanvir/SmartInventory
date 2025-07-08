import express from 'express';
import { getTopSKUs, getDailySales, getSummary,
  getAnalyticsCombined } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getAnalyticsCombined); 
router.get('/top-skus', getTopSKUs);
router.get('/daily-sales', getDailySales);
router.get('/summary', getSummary);

router.get('/', async (req, res) => {
  try {
    const [summaryData, trendData] = await Promise.all([
      getSummaryData(), // Extracted logic from getSummary
      getDailySalesData(), // Extracted logic from getDailySales
    ]);

    res.json({ summary: summaryData, trend: trendData });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
