import express from 'express';
import multer from 'multer';
import {
  getTopSKUs,
  getDailySales,
  getSummary,
  getAnalyticsCombined,
  uploadCSVAndParse
} from '../controllers/analyticsController.js';

const router = express.Router();

//  Use in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getAnalyticsCombined);
router.get('/top-skus', getTopSKUs);
router.get('/daily-sales', getDailySales);
router.get('/summary', getSummary);

//  This will pass `req.file.buffer` to controller
router.post('/upload-csv', upload.single('file'), uploadCSVAndParse);

export default router;
