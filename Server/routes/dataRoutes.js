import express from 'express';
import {
  uploadCSV,
  getSalesData,
  getSKUList,
  deleteAllBills,
  getRecentSales
} from '../controllers/dataController.js';

const router = express.Router();

router.post('/upload', uploadCSV);
router.get('/sales', getSalesData);
router.get('/skus', getSKUList);
router.delete('/clear', deleteAllBills);
router.get("/recent", getRecentSales);


export default router;
