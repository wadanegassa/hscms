require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { seedAdmin } = require('./utils/seeder');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const defaultUri = 'mongodb://localhost:27017/harari_savings';
const mongoUri = process.env.MONGO_URI || defaultUri;
if (!process.env.MONGO_URI) {
  console.warn('WARNING: `MONGO_URI` not set in environment. Using local fallback. Create a `.env` and set `MONGO_URI` to your DB connection string for production.');
}

connectDB(mongoUri)
  .then(async () => {
    // seed admin
    await seedAdmin(process.env);
  })
  .catch((e) => console.error(e));

app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
