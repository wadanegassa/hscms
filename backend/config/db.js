const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Try to extract host information without revealing credentials
    try {
      const afterScheme = uri.split('://')[1] || uri;
      const withoutCreds = afterScheme.includes('@') ? afterScheme.split('@')[1] : afterScheme;
      const host = withoutCreds.split('/')[0];
      console.log(`MongoDB connected to ${host}`);
    } catch (e) {
      console.log('MongoDB connected');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
