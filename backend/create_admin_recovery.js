require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/harari_savings';

mongoose.connect(mongoUri)
    .then(async () => {
        console.log('Connected to DB');

        const email = 'admin@hscms.et';
        const password = 'admin123!';

        // Check if exists
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('User already exists, updating password...');
            existing.password = password;
            existing.role = 'admin';
            existing.status = 'active';
            await existing.save();
            console.log('Admin updated successfully');
        } else {
            console.log('Creating new admin user...');
            await User.create({
                fullName: 'Super Admin',
                email,
                password, // Plain text as per current config
                role: 'admin',
                status: 'active',
                phone: '0000000000'
            });
            console.log('Admin created successfully');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
