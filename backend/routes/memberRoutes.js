const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const member = require('../controllers/memberController');

router.use(auth, role('member'));

router.get('/savings', member.getSavings);
router.post('/goal', member.createGoal);
router.get('/goal', member.getGoal);
router.get('/loan/eligibility', member.checkEligibility);
router.post('/loan/apply', member.applyLoan);
router.get('/loans', member.getLoansForMember);
router.get('/repayments/:loanId', member.getRepaymentsForLoan);
router.get('/profile', member.getProfile);
router.put('/profile', member.updateProfile);
router.get('/notifications', member.getNotifications);
router.patch('/notifications/:id/read', member.markNotificationRead);

module.exports = router;
