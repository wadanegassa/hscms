const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    loanMultiplier: { type: Number, default: 3 },
    interestRate: { type: Number, default: 5 },
    minSavingsForLoan: { type: Number, default: 1000 },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
