import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    totalQuantity: { type: Number, required: true },
    availableQuantity: { type: Number, required: true },
    lowStockThreshold: { type: Number, required: true },   
},{timestamps: true});

const Item = mongoose.model('Item', itemSchema);

export default Item;