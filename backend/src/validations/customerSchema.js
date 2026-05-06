const Joi = require('joi');
const ValidationUtils = require('./baseSchema');

// Customer validation schema
const customerSchema = {
  // Create customer request
  create: Joi.object({
    first_name: Joi.string().trim().min(1).max(100).required(),
    last_name: Joi.string().trim().min(1).max(100).required(),
    email: Joi.string().email().max(255).required(),
    phone: Joi.string().trim().min(8).max(20).optional(),
    company: Joi.string().trim().min(1).max(200).optional(),
    address: Joi.object({
      street: Joi.string().trim().min(1).max(255),
      city: Joi.string().trim().min(1).max(100),
      state: Joi.string().trim().min(1).max(100),
      postal_code: Joi.string().trim().min(3).max(20),
      country: Joi.string().trim().min(2).max(100)
    }).optional(),
    contact_preferences: Joi.object({
      email_notifications: Joi.boolean().default(true),
      sms_notifications: Joi.boolean().default(false),
      marketing_emails: Joi.boolean().default(false)
    }).optional(),
    notes: Joi.string().trim().max(2000).optional(),
    metadata: Joi.object().optional()
  }),

  // Update customer request
  update: Joi.object({
    first_name: Joi.string().trim().min(1).max(100),
    last_name: Joi.string().trim().min(1).max(100),
    email: Joi.string().email().max(255),
    phone: Joi.string().trim().min(8).max(20),
    company: Joi.string().trim().min(1).max(200),
    address: Joi.object({
      street: Joi.string().trim().min(1).max(255),
      city: Joi.string().trim().min(1).max(100),
      state: Joi.string().trim().min(1).max(100),
      postal_code: Joi.string().trim().min(3).max(20),
      country: Joi.string().trim().min(2).max(100)
    }),
    contact_preferences: Joi.object({
      email_notifications: Joi.boolean(),
      sms_notifications: Joi.boolean(),
      marketing_emails: Joi.boolean()
    }),
    notes: Joi.string().trim().max(2000),
    metadata: Joi.object()
  }),

  // Change status
  changeStatus: Joi.object({
    status: Joi.string().valid('active', 'inactive', 'suspended', 'archived').required(),
    reason: Joi.string().trim().max(500).optional()
  }),

  // Search parameters
  search: Joi.object({
    search: Joi.string().trim().min(1).max(100),
    status: Joi.string().valid('active', 'inactive', 'suspended', 'archived'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).fork(['search', 'status', 'startDate', 'endDate'], schema => schema.optional())
};

module.exports = customerSchema;
