const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const notification = require('../controllers/notificationController');

router.use(auth);
router.get('/', notification.listNotifications);
router.patch('/:id/read', notification.markRead);

module.exports = router;
