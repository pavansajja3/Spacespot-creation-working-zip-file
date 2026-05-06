const { Op } = require('sequelize');
const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  static async createNotification(data, createdBy) {
    const notification = await Notification.create({
      ...data,
      created_by: createdBy
    });

    return notification;
  }

  static async getUserNotifications(userId, query = {}) {
    const {
      page = 1,
      limit = 20,
      is_read,
      notification_type,
      date_from,
      date_to,
      sortBy = 'sent_at',
      order = 'DESC'
    } = query;

    const offset = (page - 1) * limit;
    
    const where = { user_id: userId };
    
    if (is_read !== undefined) {
      where.is_read = is_read;
    }
    if (notification_type) {
      where.notification_type = notification_type;
    }
    if (date_from) {
      where.sent_at = { [Op.gte]: new Date(date_from) };
    }
    if (date_to) {
      where.sent_at = { [Op.lte]: new Date(date_to) };
    }

    const { count, rows } = await Notification.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      paranoid: false
    });

    return {
      notifications: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new Error('Notification not found');
    }

    await notification.update({
      is_read: true,
      read_at: new Date()
    });

    return notification;
  }

  static async markAllAsRead(userId) {
    const now = new Date();
    await Notification.update(
      { is_read: true, read_at: now },
      { where: { user_id: userId, is_read: false } }
    );

    return { message: 'All notifications marked as read' };
  }

  static async deleteNotification(notificationId, userId) {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new Error('Notification not found');
    }

    await notification.update({
      deleted_at: new Date(),
      deleted_by: userId
    });

    return { message: 'Notification deleted successfully' };
  }

  static async deleteAllReadNotifications(userId) {
    const deletedCount = await Notification.destroy({
      where: {
        user_id: userId,
        is_read: true,
        deleted_at: null
      }
    });

    return { message: `Deleted ${deletedCount} read notifications` };
  }

  static async getUnreadCount(userId) {
    return await Notification.count({
      where: {
        user_id: userId,
        is_read: false
      }
    });
  }

  static async getNotificationStatistics(userId) {
    const totalNotifications = await Notification.count({
      where: {
        user_id: userId,
        deleted_at: null
      }
    });

    const unreadCount = await Notification.count({
      where: {
        user_id: userId,
        is_read: false,
        deleted_at: null
      }
    });

    const byStatus = await Notification.findAll({
      attributes: [
        'is_read',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: {
        user_id: userId,
        deleted_at: null
      },
      group: ['is_read']
    });

    const byType = await Notification.findAll({
      attributes: [
        'notification_type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: {
        user_id: userId,
        deleted_at: null
      },
      group: ['notification_type']
    });

    return {
      total: totalNotifications,
      unread: unreadCount,
      read: totalNotifications - unreadCount,
      by_status: byStatus,
      by_type: byType
    };
  }
}

module.exports = NotificationService;
