const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  purpose: { type: String },
  status: { type: String, enum: ['pending','approved','rejected','active','completed'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', loanSchema);
