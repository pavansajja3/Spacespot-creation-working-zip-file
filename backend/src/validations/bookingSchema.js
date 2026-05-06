const Joi = require('joi');
const ValidationUtils = require('./baseSchema');

// Booking validation schema
const bookingSchema = {
  // Create booking request
  create: Joi.object({
    unit_id: Joi.number().integer().positive().required(),
    customer_id: Joi.number().integer().positive().required(),
    booking_date: Joi.date().iso().required(),
    duration_days: Joi.number().integer().positive().required(),
    purpose: Joi.string().trim().min(1).max(500).optional(),
    expected_guests: Joi.number().integer().positive().optional(),
    special_requests: Joi.string().trim().max(1000).optional(),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out').default('pending')
  }),

  // Update booking request
  update: Joi.object({
    booking_date: Joi.date().iso(),
    duration_days: Joi.number().integer().positive(),
    purpose: Joi.string().trim().min(1).max(500),
    expected_guests: Joi.number().integer().positive(),
    special_requests: Joi.string().trim().max(1000),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out')
  }),

  // Confirm booking
  confirm: Joi.object({
    confirmation_code: Joi.string().trim().max(50).optional(),
    additional_terms: Joi.string().trim().max(1000).optional()
  }),

  // Cancel booking
  cancel: Joi.object({
    reason: Joi.string().trim().max(500).required(),
    refund_percentage: Joi.number().min(0).max(100).optional()
  }),

  // Check in/out
  checkInOut: Joi.object({
    action: Joi.string().valid('check_in', 'check_out').required(),
    notes: Joi.string().trim().max(500).optional()
  }),

  // Search parameters
  search: Joi.object({
    search: Joi.string().trim().min(1).max(100),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'),
    unit_id: Joi.number().integer().positive(),
    customer_id: Joi.number().integer().positive(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).fork(['search', 'status', 'unit_id', 'customer_id', 'startDate', 'endDate'], schema => schema.optional())
};

module.exports = bookingSchema;
