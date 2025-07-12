import Product from '../models/product.js';
import csv from 'csv-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// ========================
// Product CRUD Controllers
// ========================

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const { sku } = req.params;
  try {
    const updated = await Product.findOneAndUpdate({ sku }, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { sku } = req.params;
  try {
    await Product.deleteOne({ sku });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// =========================
// CSV Upload Controller
// =========================

// Multer config to store uploaded file temporarily
const upload = multer({ dest: 'uploads/' });
export const uploadMiddleware = upload.single('file');

export const uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const results = [];
  const filePath = path.join(process.cwd(), req.file.path);

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        for (const row of results) {
          const { sku, name, category, price, stock } = row;

          if (!sku || !name) continue;

          await Product.findOneAndUpdate(
            { sku },
            {
              sku,
              name,
              category,
              price: parseFloat(price),
              stock: parseInt(stock),
            },
            { upsert: true, new: true }
          );
        }

        fs.unlinkSync(filePath); // clean up uploaded file
        res.status(200).json({ message: 'CSV uploaded and synced successfully' });
      });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Failed to process CSV' });
  }
};
