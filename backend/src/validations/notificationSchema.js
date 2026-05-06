const Joi = require('joi');
const ValidationUtils = require('./baseSchema');

// Notification validation schema
const notificationSchema = {
  // Create notification request
  create: Joi.object({
    notification_type: Joi.string().valid('email', 'sms', 'push', 'in_app', 'webhook').required(),
    recipient_id: Joi.number().integer().positive().required(),
    recipient_type: Joi.string().valid('customer', 'tenant', 'landlord', 'property_manager', 'admin').required(),
    title: Joi.string().trim().min(1).max(255).required(),
    message: Joi.string().trim().min(1).max(5000).required(),
    notification_category: Joi.string().valid('lease', 'payment', 'booking', 'maintenance', 'document', 'system', 'marketing').optional(),
    priority: Joi.string().valid('low', 'normal', 'high', 'urgent').default('normal'),
    data: Joi.object().optional(),
    scheduled_at: Joi.date().iso().allow(null),
    expiration_at: Joi.date().iso().allow(null)
  }),

  // Update notification request
  update: Joi.object({
    title: Joi.string().trim().min(1).max(255),
    message: Joi.string().trim().min(1).max(5000),
    priority: Joi.string().valid('low', 'normal', 'high', 'urgent'),
    status: Joi.string().valid('sent', 'failed', 'pending', 'scheduled'),
    read_at: Joi.date().iso()
  }),

  // Mark as read
  markAsRead: Joi.object({
    notification_ids: Joi.array().items(Joi.number().integer().positive()).required(),
    read_at: Joi.date().iso().default(() => new Date())
  }),

  // Mark as unread
  markAsUnread: Joi.object({
    notification_ids: Joi.array().items(Joi.number().integer().positive()).required(),
    read_at: Joi.date().iso().allow(null)
  }),

  // Bulk send notification
  bulkSend: Joi.object({
    notification_type: Joi.string().valid('email', 'sms', 'push').required(),
    recipient_ids: Joi.array().items(Joi.number().integer().positive()).min(1).max(1000).required(),
    title: Joi.string().trim().min(1).max(255).required(),
    message: Joi.string().trim().min(1).max(5000).required(),
    notification_category: Joi.string().valid('lease', 'payment', 'booking', 'maintenance', 'document', 'system', 'marketing'),
    priority: Joi.string().valid('low', 'normal', 'high', 'urgent'),
    data: Joi.object().optional()
  }),

  // Search parameters
  search: Joi.object({
    recipient_id: Joi.number().integer().positive(),
    notification_type: Joi.string().valid('email', 'sms', 'push', 'in_app', 'webhook'),
    notification_category: Joi.string().valid('lease', 'payment', 'booking', 'maintenance', 'document', 'system', 'marketing'),
    status: Joi.string().valid('sent', 'failed', 'pending', 'scheduled'),
    priority: Joi.string().valid('low', 'normal', 'high', 'urgent'),
    unread_only: Joi.boolean(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).fork(['recipient_id', 'notification_type', 'notification_category', 'status', 'priority', 'unread_only', 'startDate', 'endDate'], schema => schema.optional())
};

module.exports = notificationSchema;
