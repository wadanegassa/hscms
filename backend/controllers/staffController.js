const Saving = require('../models/Saving');
const Repayment = require('../models/Repayment');
const Loan = require('../models/Loan');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const { success, error } = require('../utils/response');

const User = require('../models/User');

exports.registerMember = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, nationalId, bankAccount, telebirr, occupation, organizationName } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return error(res, 'Email already in use', 400);

    // Create member user (plain text password as per requirement)
    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      nationalId,
      bankAccount,
      telebirr,
      occupation,
      organizationName,
      role: 'member',
      status: 'active'
    });

    await user.save();
    await AuditLog.create({ action: `Registered member ${email}`, performedBy: req.user._id, targetEntity: `User:${user._id}` });
    success(res, { id: user._id, fullName: user.fullName, email: user.email, password: user.password }, 'Member registered', 201);
  } catch (err) {
    next(err);
  }
};

exports.memberLookup = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return error(res, 'Email required', 400);
    const user = await User.findOne({ email, role: 'member' });
    if (!user) return error(res, 'Member not found', 404);
    const savingsAgg = await Saving.aggregate([
      { $match: { memberId: user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalSaved = savingsAgg[0] ? savingsAgg[0].total : 0;
    success(res, { id: user._id, fullName: user.fullName, email: user.email, totalSaved });
  } catch (err) {
    next(err);
  }
};

exports.createSaving = async (req, res, next) => {
  try {
    const { memberId, amount, paymentMethod } = req.body;
    const saving = await Saving.create({ memberId, amount, paymentMethod, recordedBy: req.user._id });
    await AuditLog.create({ action: `Recorded saving ${amount}`, performedBy: req.user._id, targetEntity: `Saving:${saving._id}` });
    await Notification.create({ userId: memberId, message: `A saving of ${amount} has been recorded.` });
    success(res, saving, 'Saving recorded', 201);
  } catch (err) { next(err); }
};

exports.createRepayment = async (req, res, next) => {
  try {
    const { loanId, amount, paymentMethod } = req.body;
    const loan = await Loan.findById(loanId);
    if (!loan) return error(res, 'Loan not found', 404);
    if (loan.status !== 'active' && loan.status !== 'approved') return error(res, 'Loan not active for repayment', 400);
    // check total repaid
    const RepaymentModel = require('../models/Repayment');
    const repaidAgg = await RepaymentModel.aggregate([
      { $match: { loanId: loan._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRepaid = repaidAgg[0] ? repaidAgg[0].total : 0;
    const remaining = loan.amount + (loan.amount * loan.interestRate / 100) - totalRepaid;
    if (amount > remaining) return error(res, 'Payment exceeds remaining amount', 400);
    const repayment = await Repayment.create({ loanId, amount, paymentMethod, recordedBy: req.user._id });
    await AuditLog.create({ action: `Recorded repayment ${amount}`, performedBy: req.user._id, targetEntity: `Repayment:${repayment._id}` });
    await Notification.create({ userId: loan.memberId, message: `A repayment of ${amount} was recorded for your loan.` });
    // update loan status if fully paid
    const newRepaid = totalRepaid + amount;
    const totalDue = loan.amount + (loan.amount * loan.interestRate / 100);
    if (newRepaid >= totalDue) {
      loan.status = 'completed';
      await loan.save();
      await Notification.create({ userId: loan.memberId, message: `Your loan has been fully repaid.` });
    }
    success(res, repayment, 'Repayment recorded', 201);
  } catch (err) { next(err); }
};

exports.getMemberLoans = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const loans = await Loan.find({ memberId }).sort({ createdAt: -1 }).lean();

    const loansWithBalance = await Promise.all(loans.map(async (loan) => {
      const totalDue = loan.amount + (loan.amount * loan.interestRate / 100);
      const repaidAgg = await Repayment.aggregate([
        { $match: { loanId: loan._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalRepaid = repaidAgg[0] ? repaidAgg[0].total : 0;
      return {
        ...loan,
        remainingBalance: Math.max(0, totalDue - totalRepaid),
        totalRepaid
      };
    }));

    success(res, loansWithBalance);
  } catch (err) { next(err); }
};

exports.listLoansForStaff = async (req, res, next) => {
  try {
    const loans = await Loan.find()
      .populate('memberId', 'fullName email')
      .sort({ createdAt: -1 })
      .lean();

    const loansWithBalance = await Promise.all(loans.map(async (loan) => {
      const totalDue = loan.amount + (loan.amount * loan.interestRate / 100);
      const repaidAgg = await Repayment.aggregate([
        { $match: { loanId: loan._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalRepaid = repaidAgg[0] ? repaidAgg[0].total : 0;
      return {
        ...loan,
        remainingBalance: Math.max(0, totalDue - totalRepaid),
        totalRepaid
      };
    }));

    success(res, loansWithBalance);
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const memberCount = await User.countDocuments({ role: 'member' });

    const savingsAgg = await Saving.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalSavings = savingsAgg[0] ? savingsAgg[0].total : 0;

    const activeLoans = await Loan.countDocuments({ status: { $in: ['active', 'approved'] } });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todaySavingsAgg = await Saving.aggregate([
      { $match: { date: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const todaySavings = todaySavingsAgg[0] ? todaySavingsAgg[0].total : 0;

    const recentSavings = await Saving.find()
      .populate('memberId', 'fullName')
      .sort({ date: -1 })
      .limit(5);

    success(res, {
      memberCount,
      totalSavings,
      activeLoans,
      todaySavings,
      recentSavings
    });
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    success(res, user);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const updateData = { fullName, email, phone };
    if (password) updateData.password = password;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
    success(res, user);
  } catch (err) { next(err); }
};
