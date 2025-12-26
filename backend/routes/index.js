const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/admin', require('./adminRoutes'));
router.use('/staff', require('./staffRoutes'));
router.use('/member', require('./memberRoutes'));
router.use('/notifications', require('./notificationRoutes'));

module.exports = router;
