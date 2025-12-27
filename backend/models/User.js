const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['admin', 'staff', 'member'], default: 'member' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  nationalId: { type: String },
  bankAccount: { type: String },
  telebirr: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
