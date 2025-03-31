import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true },
    action: { type: String, enum: ['borrowed', 'returned'], required: true },
    date: { type: Date, default: Date.now },
    expectedReturnDate: { 
        type: Date,
        required: function() { return this.action === 'borrowed'; }
    }
},{timestamps: true});

const UsageLog = mongoose.model('UsageLog', usageLogSchema);

export default UsageLog;