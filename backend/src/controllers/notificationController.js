const NotificationService = require('../services/notificationService');
const { validateCreateNotification } = require('../validations/validation');

class NotificationController {
  // GET /api/notifications - Get all notifications for authenticated user
  static async getAllNotifications(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        type,
        readAt,
        sortBy = 'created_at',
        order = 'DESC'
      } = req.query;

      const userId = req.user.id;

      const notifications = await NotificationService.getAllNotifications(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        type,
        readAt,
        sortBy,
        order
      });

      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('Error in getAllNotifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications',
        error: error.message
      });
    }
  }

  // GET /api/notifications/:id - Get notification by ID
  static async getNotificationById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await NotificationService.getNotificationById(id, userId);

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      console.error('Error in getNotificationById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notification',
        error: error.message
      });
    }
  }

  // POST /api/notifications - Create new notification
  static async createNotification(req, res) {
    try {
      const { body } = req;
      const userId = req.user.id;

      const notification = await NotificationService.createNotification(body, userId);

      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification
      });
    } catch (error) {
      console.error('Error in createNotification:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to create notification',
        error: error.message
      });
    }
  }

  // PUT /api/notifications/:id/mark-as-read - Mark notification as read
  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await NotificationService.markAsRead(id, userId);

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error) {
      console.error('Error in markAsRead:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to mark notification as read',
        error: error.message
      });
    }
  }

  // PUT /api/notifications/:id/mark-as-unread - Mark notification as unread
  static async markAsUnread(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await NotificationService.markAsUnread(id, userId);

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification marked as unread',
        data: notification
      });
    } catch (error) {
      console.error('Error in markAsUnread:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to mark notification as unread',
        error: error.message
      });
    }
  }

  // PUT /api/notifications/:id/delete - Delete notification
  static async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await NotificationService.deleteNotification(id, userId);

      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to delete notification',
        error: error.message
      });
    }
  }

  // PUT /api/notifications/mark-all-as-read - Mark all notifications as read
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      const count = await NotificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: `Marked ${count} notifications as read`
      });
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to mark all notifications as read',
        error: error.message
      });
    }
  }

  // DELETE /api/notifications/delete-all-read - Delete all read notifications
  static async deleteAllRead(req, res) {
    try {
      const userId = req.user.id;

      const count = await NotificationService.deleteAllRead(userId);

      res.json({
        success: true,
        message: `Deleted ${count} read notifications`
      });
    } catch (error) {
      console.error('Error in deleteAllRead:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to delete read notifications',
        error: error.message
      });
    }
  }

  // GET /api/notifications/unread-count - Get unread notification count
  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;

      const count = await NotificationService.getUnreadCount(userId);

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unread count',
        error: error.message
      });
    }
  }

  // GET /api/notifications/preferences - Get notification preferences
  static async getPreferences(req, res) {
    try {
      const userId = req.user.id;

      const preferences = await NotificationService.getPreferences(userId);

      res.json({
        success: true,
        data: preferences
      });
    } catch (error) {
      console.error('Error in getPreferences:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch preferences',
        error: error.message
      });
    }
  }

  // PUT /api/notifications/preferences - Update notification preferences
  static async updatePreferences(req, res) {
    try {
      const { body } = req;
      const userId = req.user.id;

      const preferences = await NotificationService.updatePreferences(userId, body);

      res.json({
        success: true,
        message: 'Preferences updated successfully',
        data: preferences
      });
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update preferences',
        error: error.message
      });
    }
  }

  // POST /api/notifications/send-email - Send email notification
  static async sendEmailNotification(req, res) {
    try {
      const { body } = req;
      const { email, templateId, data } = body;
      const userId = req.user.id;

      const result = await NotificationService.sendEmail(email, templateId, data, userId);

      res.json({
        success: true,
        message: 'Email notification sent successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in sendEmailNotification:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to send email notification',
        error: error.message
      });
    }
  }

  // POST /api/notifications/send-sms - Send SMS notification
  static async sendSmsNotification(req, res) {
    try {
      const { body } = req;
      const { phoneNumber, message } = body;
      const userId = req.user.id;

      const result = await NotificationService.sendSms(phoneNumber, message, userId);

      res.json({
        success: true,
        message: 'SMS notification sent successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in sendSmsNotification:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to send SMS notification',
        error: error.message
      });
    }
  }
}

module.exports = NotificationController;
