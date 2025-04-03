import mongoose from 'mongoose';

// Schema for each individual instance (e.g., a laptop unit)
const instanceSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['available', 'borrowed'], default: 'available' }
}, { _id: false });

// Main Item schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true,unique : true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  totalQuantity: { type: Number, required: true },
  availableQuantity: { type: Number, required: true },
  lowStockThreshold: { type: Number, required: true },
  // Array to store each physical unit's details
  instances: [instanceSchema]
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

export default Item;
