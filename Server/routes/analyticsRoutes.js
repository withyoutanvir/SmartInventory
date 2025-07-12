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
const upload = multer({ dest: 'uploads/' });

router.get('/', getAnalyticsCombined);
router.get('/top-skus', getTopSKUs);
router.get('/daily-sales', getDailySales);
router.get('/summary', getSummary);
router.post('/upload-csv', upload.single('file'), uploadCSVAndParse);

export default router;
