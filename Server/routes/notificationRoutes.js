import express from 'express';
import { getLowStockAlerts } from '../controllers/notificationController.js';

const router = express.Router();
router.get('/low-stock', getLowStockAlerts);

export default router;
