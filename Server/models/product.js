import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  supplier: String,
  price: Number,
  min_stock_level: { type: Number, default: 10 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
