import Product from '../models/product.js';

export const getLowStockAlerts = async (req, res) => {
  const products = await Product.find({});
  const lowStock = products.filter(p => p.currentStock <= p.min_stock_level);
  res.json(lowStock);
};
