
import Product from '../models/product.js';

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
  const products = await Product.find({});
  res.status(200).json(products);
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
