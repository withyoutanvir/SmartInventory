import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const billSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  items: [itemSchema],
});


const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema);

export default Bill;
