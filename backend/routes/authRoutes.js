const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Only admin can create staff/member via register route in this design
router.post('/login', login);
router.post('/register', auth, role('admin'), register);

module.exports = router;
