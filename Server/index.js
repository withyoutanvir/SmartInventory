import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Routes
import dataRoutes from './routes/dataRoutes.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(morgan('dev'));

// Mount Routes
app.use('/api/data', dataRoutes);
app.use('/api/products', productRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));