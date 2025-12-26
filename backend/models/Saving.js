const mongoose = require('mongoose');

const savingSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['cash', 'telebirr', 'bank'], default: 'cash' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Saving', savingSchema);
