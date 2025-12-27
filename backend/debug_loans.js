require('dotenv').config();
const mongoose = require('mongoose');
const Loan = require('./models/Loan');
const User = require('./models/User');

async function debugLoans() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const loans = await Loan.find({ status: 'pending' }).populate('memberId');
        console.log(`Found ${loans.length} pending loans`);

        for (const loan of loans) {
            console.log(`Loan ID: ${loan._id}`);
            if (loan.memberId) {
                console.log(`  -> Populated Member: ${loan.memberId.fullName} (${loan.memberId.email})`);
                console.log(`  -> National ID: ${loan.memberId.nationalId}, Bank: ${loan.memberId.bankAccount}, Telebirr: ${loan.memberId.telebirr}`);
            } else {
                console.log(`  -> MEMBER NOT FOUND (Populate returned null)`);
                console.log(`  -> Raw Member ID: ${loan.get('memberId')}`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

debugLoans();
