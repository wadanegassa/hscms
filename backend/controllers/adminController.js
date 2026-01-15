const User = require('../models/User');
const Saving = require('../models/Saving');
const Loan = require('../models/Loan');
const Repayment = require('../models/Repayment');
const AuditLog = require('../models/AuditLog');
const Settings = require('../models/Settings');
const { success, error } = require('../utils/response');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').lean();

    const enrichedUsers = await Promise.all(users.map(async (user) => {
      if (user.role === 'member') {
        const savingsAgg = await Saving.aggregate([
          { $match: { memberId: user._id } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalSaved = savingsAgg[0] ? savingsAgg[0].total : 0;

        const loan = await Loan.findOne({ memberId: user._id, status: { $in: ['active', 'approved', 'pending'] } });

        return {
          ...user,
          totalSaved,
          activeLoan: loan ? { amount: loan.amount, status: loan.status } : null
        };
      }
      return user;
    }));

    success(res, enrichedUsers);
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
    if (req.body.nationalId !== undefined) user.nationalId = req.body.nationalId;
    if (req.body.bankAccount !== undefined) user.bankAccount = req.body.bankAccount;
    if (req.body.telebirr !== undefined) user.telebirr = req.body.telebirr;

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
    const { fullName, email, password, phone, nationalId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return error(res, 'Email exists', 400);
    // const bcrypt = require('bcrypt');
    // const hashed = await bcrypt.hash(password, 10);
    const staff = await User.create({ fullName, email, password, phone, nationalId, role: 'staff' });
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

exports.reportsSavingsDetailed = async (req, res, next) => {
  try {
    const savings = await Saving.find().populate('memberId', 'fullName email phone').sort({ date: -1 });
    success(res, savings);
  } catch (err) { next(err); }
};

exports.reportsLoansDetailed = async (req, res, next) => {
  try {
    const loans = await Loan.find().populate('memberId', 'fullName email phone').sort({ createdAt: -1 }).lean();

    const loansWithStats = await Promise.all(loans.map(async (loan) => {
      const totalDue = loan.amount + (loan.amount * loan.interestRate / 100);
      const repaidAgg = await Repayment.aggregate([
        { $match: { loanId: loan._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalRepaid = repaidAgg[0] ? repaidAgg[0].total : 0;
      return {
        ...loan,
        totalRepaid,
        remainingBalance: Math.max(0, totalDue - totalRepaid)
      };
    }));

    success(res, loansWithStats);
  } catch (err) { next(err); }
};

exports.reportsRepaymentsDetailed = async (req, res, next) => {
  try {
    const repayments = await Repayment.find()
      .populate({
        path: 'loanId',
        populate: { path: 'memberId', select: 'fullName email phone' }
      })
      .sort({ date: -1 });

    // Map to hoist memberId to top level for frontend compatibility
    const formattedRepayments = repayments.map(r => {
      const rep = r.toObject();
      if (rep.loanId && rep.loanId.memberId) {
        rep.memberId = rep.loanId.memberId;
      }
      return rep;
    });

    success(res, formattedRepayments);
  } catch (err) { next(err); }
};

exports.reportsMembersDetailed = async (req, res, next) => {
  try {
    const members = await User.find({ role: 'member' }).select('-password').sort({ createdAt: -1 });
    success(res, members);
  } catch (err) { next(err); }
};

exports.reportsStaffDetailed = async (req, res, next) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password').sort({ createdAt: -1 });
    success(res, staff);
  } catch (err) { next(err); }
};

exports.auditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(500).populate('performedBy', 'fullName');
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
            _id: { $dateToString: { format: "%H:%M", date: "$date", timezone: "Africa/Addis_Ababa" } },
            total: { $sum: "$amount" }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 10 },
        { $sort: { _id: 1 } }
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
exports.globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return success(res, { users: [], loans: [], savings: [], auditLogs: [] });

    const regex = new RegExp(q, 'i');

    const [users, loans, savings, auditLogs] = await Promise.all([
      User.find({
        $or: [
          { fullName: regex },
          { email: regex },
          { phone: regex },
          { nationalId: regex }
        ]
      }).select('-password').limit(10).lean(),

      Loan.find({
        $or: [
          { status: regex },
          { purpose: regex }
        ]
      }).populate('memberId', 'fullName email').limit(10).lean(),

      Saving.find({
        // Savings don't have many searchable text fields, maybe by member name?
        // We'll skip complex joins for now and search by amount if it's a number
      }).populate('memberId', 'fullName email').limit(10).lean(),

      AuditLog.find({
        $or: [
          { action: regex },
          { targetEntity: regex }
        ]
      }).populate('performedBy', 'fullName').limit(10).sort({ timestamp: -1 }).lean()
    ]);

    // Special case for savings: filter by member name manually if needed or just return recent
    // For now, we'll just return the results from the queries above.

    success(res, {
      users,
      loans,
      savings,
      auditLogs
    });
  } catch (err) { next(err); }
};
