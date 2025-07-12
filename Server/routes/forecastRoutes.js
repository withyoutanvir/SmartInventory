import express from 'express';
import { getForecast, getReorderSuggestions } from '../controllers/forecastController.js';

const router = express.Router();

router.get('/', getForecast);               
router.get('/reorder', getReorderSuggestions); 

export default router;
