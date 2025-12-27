const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const staff = require('../controllers/staffController');

router.use(auth, role('staff', 'admin'));

router.post('/register-member', staff.registerMember);
router.get('/member-lookup', staff.memberLookup);
router.post('/savings', staff.createSaving);
router.post('/repayment', staff.createRepayment);
router.get('/loans/member/:memberId', staff.getMemberLoans);
router.get('/loans', staff.listLoansForStaff);
router.get('/dashboard-stats', staff.getDashboardStats);
router.get('/profile', staff.getProfile);
router.put('/profile', staff.updateProfile);

module.exports = router;
