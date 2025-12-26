const User = require('../models/User');
const bcrypt = require('bcrypt');

const seedAdmin = async (env) => {
  const email = env.SEED_ADMIN_EMAIL;
  const password = env.SEED_ADMIN_PASSWORD || 'AdminPass123';

  const existing = await User.findOne({ email });
  if (existing) {
    // Update password to plain text if it exists (to fix previous hashed ones)
    existing.password = password;
    await existing.save();
    // console.log('Updated admin user password:', email);
  } else {
    await User.create({ fullName: 'Seed Admin', email, password, role: 'admin' });
    console.log('Seeded admin user:', email);
  }
};

module.exports = { seedAdmin };
