const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { success, error } = require('../utils/response');

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return error(res, 'Email already in use', 400);
    // REMOVED bcrypt hashing as per requirement
    const user = await User.create({ fullName, email, password, phone, role });
    await user.save();
    success(res, { id: user._id, email: user.email }, 'User created', 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return error(res, 'Invalid credentials', 401);
    if (user.status === 'suspended') return error(res, 'Account suspended', 403);

    // REMOVED bcrypt compare, using direct comparison
    if (password !== user.password) return error(res, 'Invalid credentials', 401);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    success(res, { token, user: { id: user._id, email: user.email, role: user.role } }, 'Logged in');
  } catch (err) {
    next(err);
  }
};
