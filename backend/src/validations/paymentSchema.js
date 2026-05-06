const Joi = require('joi');
const ValidationUtils = require('./baseSchema');

// Payment validation schema
const paymentSchema = {
  // Create payment request
  create: Joi.object({
    lease_id: Joi.number().integer().positive().required(),
    amount: Joi.number().positive().precision(2).required(),
    payment_type: Joi.string().valid('rent', 'security_deposit', 'late_fee', 'other').required(),
    payment_method: Joi.string().valid('credit_card', 'debit_card', 'bank_transfer', 'check', 'cash', 'other').required(),
    due_date: Joi.date().iso().required(),
    payment_date: Joi.date().iso().allow(null),
    status: Joi.string().valid('pending', 'completed', 'failed', 'refunded', 'partial').default('pending'),
    description: Joi.string().trim().max(500).optional(),
    reference_number: Joi.string().trim().max(100).optional(),
    installments: Joi.array().items(Joi.object({
      amount: Joi.number().positive().precision(2).required(),
      due_date: Joi.date().iso().required()
    })).optional()
  }),

  // Update payment request
  update: Joi.object({
    amount: Joi.number().positive().precision(2),
    due_date: Joi.date().iso(),
    payment_date: Joi.date().iso(),
    status: Joi.string().valid('pending', 'completed', 'failed', 'refunded', 'partial'),
    description: Joi.string().trim().max(500),
    reference_number: Joi.string().trim().max(100)
  }),

  // Create payment intent
  createPaymentIntent: Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    currency: Joi.string().trim().max(3).default('USD'),
    payment_method: Joi.string().valid('credit_card', 'debit_card').required(),
    customer_id: Joi.string().trim().max(100).required(),
    description: Joi.string().trim().max(500).optional(),
    metadata: Joi.object().optional()
  }),

  // Process payment
  processPayment: Joi.object({
    payment_method_id: Joi.string().trim().max(100).required(),
    save_payment_method: Joi.boolean().default(false),
    statement_descriptor: Joi.string().trim().max(25).optional(),
    metadata: Joi.object().optional()
  }),

  // Process refund
  processRefund: Joi.object({
    amount: Joi.number().positive().precision(2).optional(),
    reason: Joi.string().trim().max(500).optional(),
    refund_method: Joi.string().valid('original_payment_method', 'bank_transfer', 'check').optional()
  }),

  // Search parameters
  search: Joi.object({
    search: Joi.string().trim().min(1).max(100),
    status: Joi.string().valid('pending', 'completed', 'failed', 'refunded', 'partial'),
    lease_id: Joi.number().integer().positive(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).fork(['search', 'status', 'lease_id', 'startDate', 'endDate'], schema => schema.optional())
};

module.exports = paymentSchema;
