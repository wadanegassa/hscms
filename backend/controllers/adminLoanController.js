const Loan = require('../models/Loan');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const { success, error } = require('../utils/response');

exports.pendingLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find({ status: 'pending' }).sort({ createdAt: -1 });
    success(res, loans);
  } catch (err) { next(err); }
};

exports.approveLoan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id);
    if (!loan) return error(res, 'Loan not found', 404);
    if (loan.status !== 'pending') return error(res, 'Loan not pending', 400);
    loan.status = 'approved';
    loan.approvedBy = req.user._id;
    await loan.save();
    await AuditLog.create({ action: `Approved loan ${loan._id}`, performedBy: req.user._id, targetEntity: `Loan:${loan._id}` });
    await Notification.create({ userId: loan.memberId, message: `Your loan for ${loan.amount} was approved.` });
    success(res, loan, 'Loan approved');
  } catch (err) { next(err); }
};

exports.rejectLoan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id);
    if (!loan) return error(res, 'Loan not found', 404);
    if (loan.status !== 'pending') return error(res, 'Loan not pending', 400);
    loan.status = 'rejected';
    loan.approvedBy = req.user._id;
    await loan.save();
    await AuditLog.create({ action: `Rejected loan ${loan._id}`, performedBy: req.user._id, targetEntity: `Loan:${loan._id}` });
    await Notification.create({ userId: loan.memberId, message: `Your loan for ${loan.amount} was rejected.` });
    success(res, loan, 'Loan rejected');
  } catch (err) { next(err); }
};
