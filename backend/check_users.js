require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/harari_savings';

mongoose.connect(mongoUri)
    .then(async () => {
        const users = await User.find({}, 'email role password');
        console.log('Users found:', JSON.stringify(users, null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
