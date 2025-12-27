const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const admin = require('../controllers/adminController');
const adminLoan = require('../controllers/adminLoanController');

router.use(auth, role('admin'));

router.get('/users', admin.listUsers);
router.patch('/users/:id/status', admin.updateUserStatus);
router.put('/users/:id', admin.updateUser);
router.delete('/users/:id', admin.deleteUser);
router.post('/create-staff', admin.createStaff);

router.get('/savings', admin.reportsSavings);
router.get('/loans', admin.reportsLoans);
router.get('/repayments', admin.reportsRepayments);
router.get('/reports/savings', admin.reportsSavings);
router.get('/reports/loans', admin.reportsLoans);
router.get('/reports/repayments', admin.reportsRepayments);
router.get('/reports/savings/detailed', admin.reportsSavingsDetailed);
router.get('/reports/loans/detailed', admin.reportsLoansDetailed);
router.get('/reports/repayments/detailed', admin.reportsRepaymentsDetailed);
router.get('/reports/members/detailed', admin.reportsMembersDetailed);
router.get('/reports/staff/detailed', admin.reportsStaffDetailed);
router.get('/dashboard-stats', admin.getDashboardStats);
router.get('/audit-logs', admin.auditLogs);
router.get('/search', admin.globalSearch);

router.get('/loans/pending', adminLoan.pendingLoans);
router.get('/loan/:id/approve', adminLoan.approveLoan);
router.post('/loan/:id/approve', adminLoan.approveLoan);
router.post('/loan/:id/reject', adminLoan.rejectLoan);

router.get('/settings', admin.getSettings);
router.put('/settings', admin.updateSettings);

module.exports = router;
// Force restart for controller update
