import express from 'express';
import multer from 'multer'; 

import {
  uploadSalesCSV,
  getSalesData,
  getSKUList,
  deleteAllBills,
  getRecentSales
} from '../controllers/dataController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadSalesCSV);

router.get('/sales', getSalesData);
router.get('/skus', getSKUList);
router.delete('/clear', deleteAllBills);
router.get("/recent", getRecentSales);

export default router;
