const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['cash','telebirr','bank'], default: 'cash' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Repayment', repaymentSchema);
