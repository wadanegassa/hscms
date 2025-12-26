const User = require('../models/User');
const Saving = require('../models/Saving');
const Loan = require('../models/Loan');
const Repayment = require('../models/Repayment');
const AuditLog = require('../models/AuditLog');
const Settings = require('../models/Settings');
const { success, error } = require('../utils/response');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    success(res, users);
  } catch (err) { next(err); }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await User.findById(id);
    if (!user) return error(res, 'User not found', 404);
    user.status = status;
    await user.save();
    await AuditLog.create({ action: `Updated status to ${status}`, performedBy: req.user._id, targetEntity: `User:${id}` });
    success(res, { id: user._id, status: user.status }, 'Status updated');
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, role } = req.body;
    const user = await User.findById(id);
    if (!user) return error(res, 'User not found', 404);

    // Update fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;

    await user.save();
    await AuditLog.create({
      action: `Updated user ${user.fullName}`,
      performedBy: req.user._id,
      targetEntity: `User:${id}`
    });
    success(res, { id: user._id, fullName: user.fullName, email: user.email }, 'User updated');
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return error(res, 'User not found', 404);

    const userName = user.fullName;
    await User.findByIdAndDelete(id);
    await AuditLog.create({
      action: `Deleted user ${userName}`,
      performedBy: req.user._id,
      targetEntity: `User:${id}`
    });
    success(res, { id }, 'User deleted successfully');
  } catch (err) { next(err); }
};

exports.createStaff = async (req, res, next) => {
  try {
    const { fullName, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return error(res, 'Email exists', 400);
    // const bcrypt = require('bcrypt');
    // const hashed = await bcrypt.hash(password, 10);
    const staff = await User.create({ fullName, email, password, phone, role: 'staff' });
    await AuditLog.create({ action: 'Created staff', performedBy: req.user._id, targetEntity: `User:${staff._id}` });
    success(res, { id: staff._id, email: staff.email }, 'Staff created', 201);
  } catch (err) { next(err); }
};

// Reports
exports.reportsSavings = async (req, res, next) => {
  try {
    const agg = await Saving.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    success(res, agg[0] || { total: 0, count: 0 });
  } catch (err) { next(err); }
};

exports.reportsLoans = async (req, res, next) => {
  try {
    const agg = await Loan.aggregate([
      { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    success(res, agg);
  } catch (err) { next(err); }
};

exports.reportsRepayments = async (req, res, next) => {
  try {
    const agg = await Repayment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    success(res, agg[0] || { total: 0, count: 0 });
  } catch (err) { next(err); }
};

exports.auditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(500);
    success(res, logs);
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalMembers,
      totalStaff,
      totalSavings,
      totalLoans,
      pendingRequests,
      savingsGrowth,
      loanDistribution,
      recentActivity
    ] = await Promise.all([
      User.countDocuments({ role: 'member' }),
      User.countDocuments({ role: 'staff' }),
      Saving.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Loan.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Loan.countDocuments({ status: 'pending' }),
      // Savings Growth (Last 6 months)
      Saving.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
            total: { $sum: "$amount" }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 6 }
      ]),
      // Loan Distribution
      Loan.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      // Recent Activity (Audit Logs)
      AuditLog.find().sort({ timestamp: -1 }).limit(5).populate('performedBy', 'fullName')
    ]);

    success(res, {
      counts: {
        members: totalMembers,
        staff: totalStaff,
        savings: totalSavings[0]?.total || 0,
        loans: totalLoans[0]?.total || 0,
        pending: pendingRequests
      },
      charts: {
        savings: savingsGrowth,
        loans: loanDistribution
      },
      recentActivity
    });
  } catch (err) { next(err); }
};

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    success(res, settings);
  } catch (err) { next(err); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const { loanMultiplier, interestRate, minSavingsForLoan } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }
    if (loanMultiplier !== undefined) settings.loanMultiplier = loanMultiplier;
    if (interestRate !== undefined) settings.interestRate = interestRate;
    if (minSavingsForLoan !== undefined) settings.minSavingsForLoan = minSavingsForLoan;
    settings.updatedAt = Date.now();
    await settings.save();
    await AuditLog.create({ action: 'Updated system settings', performedBy: req.user._id });
    success(res, settings, 'Settings updated');
  } catch (err) { next(err); }
};
