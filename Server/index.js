import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import path from 'path';

// Route Imports
import dataRoutes from './routes/dataRoutes.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// API Routes
app.use('/api/data', dataRoutes);
app.use('/api/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/analytics', analyticsRoutes); // Includes /upload-csv
app.use('/api/notifications', notificationRoutes);

// Base Test Route
app.get('/', (req, res) => {
  res.send('SmartInventory API is running...');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running at http://localhost:${PORT}`)
);
