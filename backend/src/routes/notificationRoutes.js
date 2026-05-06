const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const NotificationService = require('../services/notificationService');

// GET /api/notifications - Get user notifications
// Query params: page, limit, is_read, notification_type, date_from, date_to, sortBy, order
// Authorization: Bearer token (user)
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user.id, req.query);
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/notifications/unread-count - Get unread notification count
// Authorization: Bearer token (user)
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user.id);
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
// Authorization: Bearer token (user)
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await NotificationService.markAsRead(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
// Authorization: Bearer token (user)
router.put('/read-all', authenticate, async (req, res) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/notifications/:id - Delete notification
// Authorization: Bearer token (user)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await NotificationService.deleteNotification(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/notifications/read-all - Delete all read notifications
// Authorization: Bearer token (user)
router.delete('/read-all', authenticate, async (req, res) => {
  try {
    const result = await NotificationService.deleteAllReadNotifications(req.user.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/notifications/statistics - Get notification statistics
// Authorization: Bearer token (user)
router.get('/statistics', authenticate, async (req, res) => {
  try {
    const statistics = await NotificationService.getNotificationStatistics(req.user.id);
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
