require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const Loan = require('./backend/models/Loan');
const User = require('./backend/models/User');

async function debugLoans() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const loans = await Loan.find({ status: 'pending' });
        console.log(`Found ${loans.length} pending loans`);

        for (const loan of loans) {
            console.log(`Loan ID: ${loan._id}, Member ID: ${loan.memberId}`);
            const member = await User.findById(loan.memberId);
            if (member) {
                console.log(`  -> Found Member: ${member.fullName} (${member.email})`);
                console.log(`  -> National ID: ${member.nationalId}, Bank: ${member.bankAccount}, Telebirr: ${member.telebirr}`);
            } else {
                console.log(`  -> MEMBER NOT FOUND (Orphaned Loan)`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

debugLoans();
