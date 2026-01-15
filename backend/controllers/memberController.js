const User = require('../models/User');
const Saving = require('../models/Saving');
const Loan = require('../models/Loan');
const Repayment = require('../models/Repayment');
const Goal = require('../models/Goal');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const Settings = require('../models/Settings');
const { success, error } = require('../utils/response');

exports.getSavings = async (req, res, next) => {
  try {
    const memberId = req.user._id;
    const savings = await Saving.find({ memberId }).sort({ date: -1 });
    success(res, savings);
  } catch (err) { next(err); }
};

exports.createGoal = async (req, res, next) => {
  try {
    const memberId = req.user._id;
    const { targetAmount } = req.body;
    let goal = await Goal.findOne({ memberId });
    if (goal) {
      goal.targetAmount = targetAmount;
      goal.updatedAt = Date.now();
      await goal.save();
    } else {
      goal = await Goal.create({ memberId, targetAmount });
    }
    await AuditLog.create({ action: `Set savings goal ${targetAmount}`, performedBy: req.user._id, targetEntity: `Goal:${goal._id}` });
    success(res, goal, 'Goal saved', 201);
  } catch (err) { next(err); }
};

exports.getGoal = async (req, res, next) => {
  try {
    const memberId = req.user._id;
    const goal = await Goal.findOne({ memberId });
    if (!goal) return success(res, null, 'No goal');
    // compute progress
    const agg = await Saving.aggregate([
      { $match: { memberId: goal.memberId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalSaved = agg[0] ? agg[0].total : 0;
    const progress = goal.targetAmount > 0 ? Math.min(100, (totalSaved / goal.targetAmount) * 100) : 0;
    success(res, { goal, progress, totalSaved });
  } catch (err) { next(err); }
};

exports.applyLoan = async (req, res, next) => {
  try {
    const memberId = req.user._id;
    const { amount, purpose } = req.body;

    // Check for existing active/pending/approved loans
    const existingLoan = await Loan.findOne({
      memberId,
      status: { $in: ['pending', 'approved', 'active'] }
    });

    if (existingLoan) {
      return error(res, 'You already have an active or pending loan application.', 400);
    }

    const [agg, settings] = await Promise.all([
      Saving.aggregate([
        { $match: { memberId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Settings.findOne()
    ]);

    const totalSavings = agg[0] ? agg[0].total : 0;
    const multiplier = settings?.loanMultiplier || 3;
    const minSavings = settings?.minSavingsForLoan || 0;
    const interestRate = settings?.interestRate || 5;
    const maxLoan = totalSavings * multiplier;

    if (totalSavings < minSavings) return error(res, `Minimum savings of ${minSavings} ETB required to apply for a loan.`, 400);
    if (amount > maxLoan) return error(res, `Requested exceeds eligibility. Max allowed: ${maxLoan}`, 400);

    const loan = await Loan.create({
      memberId,
      amount,
      interestRate,
      purpose,
      status: 'pending'
    });

    await AuditLog.create({ action: `Applied for loan ${amount}`, performedBy: memberId, targetEntity: `Loan:${loan._id}` });
    await Notification.create({ userId: memberId, message: `Your loan application for ${amount} has been received.` });
    success(res, loan, 'Loan applied', 201);
  } catch (err) { next(err); }
};

exports.checkEligibility = async (req, res, next) => {
  try {
    const memberId = req.user._id;
    const [agg, settings] = await Promise.all([
      Saving.aggregate([
        { $match: { memberId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Settings.findOne()
    ]);

    const totalSavings = agg[0] ? agg[0].total : 0;
    const multiplier = settings?.loanMultiplier || 3;
    const minSavings = settings?.minSavingsForLoan || 0;
    const interestRate = settings?.interestRate || 5;
    const maxLoan = totalSavings * multiplier;
    success(res, { totalSavings, multiplier, maxLoan, minSavings, interestRate });
  } catch (err) { next(err); }
};

exports.getLoansForMember = async (req, res, next) => {
  try {
    const loans = await Loan.find({ memberId: req.user._id }).sort({ createdAt: -1 }).lean();

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

exports.getRepaymentsForLoan = async (req, res, next) => {
  try {
    const { loanId } = req.params;
    const repayments = await Repayment.find({ loanId }).sort({ date: -1 });
    success(res, repayments);
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
    if (password) updateData.password = password; // Plain text as per requirement

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');
    success(res, user, 'Profile updated successfully');
  } catch (err) { next(err); }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    success(res, notifications);
  } catch (err) { next(err); }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notification.findOneAndUpdate({ _id: id, userId: req.user._id }, { isRead: true });
    success(res, null, 'Notification marked as read');
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const memberId = req.user._id;

    const [savingsAgg, loans, notifications, recentSavings] = await Promise.all([
      Saving.aggregate([
        { $match: { memberId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Loan.find({ memberId, status: { $in: ['active', 'approved'] } }),
      Notification.find({ userId: memberId }).sort({ createdAt: -1 }).limit(5),
      Saving.find({ memberId }).sort({ date: -1 }).limit(5)
    ]);

    const totalSavings = savingsAgg[0] ? savingsAgg[0].total : 0;
    const activeLoan = loans[0] || null;

    let remainingBalance = 0;
    if (activeLoan) {
      const totalDue = activeLoan.amount + (activeLoan.amount * activeLoan.interestRate / 100);

      const repaidAgg = await Repayment.aggregate([
        { $match: { loanId: activeLoan._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalRepaid = repaidAgg[0] ? repaidAgg[0].total : 0;

      remainingBalance = Math.max(0, totalDue - totalRepaid);
    }

    success(res, {
      totalSavings,
      activeLoan,
      remainingBalance,
      notifications,
      recentSavings
    });
  } catch (err) { next(err); }
};
