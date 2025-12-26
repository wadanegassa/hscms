const Notification = require('../models/Notification');
const { success, error } = require('../utils/response');

exports.listNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    success(res, notifications);
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const n = await Notification.findById(id);
    if (!n) return error(res, 'Not found', 404);
    if (!n.userId.equals(req.user._id)) return error(res, 'Forbidden', 403);
    n.isRead = true;
    await n.save();
    success(res, n, 'Marked read');
  } catch (err) { next(err); }
};
