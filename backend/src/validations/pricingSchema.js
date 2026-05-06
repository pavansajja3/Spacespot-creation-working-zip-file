const Joi = require('joi');
const ValidationUtils = require('./baseSchema');

// Pricing validation schema
const pricingSchema = {
  // Create pricing request
  create: Joi.object({
    unit_id: Joi.number().integer().positive().required(),
    price: Joi.number().positive().precision(2).required(),
    price_type: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').required(),
    effective_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().allow(null),
    min_lease_term_days: Joi.number().integer().positive().optional(),
    max_lease_term_days: Joi.number().integer().positive().optional(),
    terms: Joi.object({
      includes_utilities: Joi.boolean().default(false),
      includes_internet: Joi.boolean().default(false),
      includes_parking: Joi.boolean().default(false),
      includes_cleaning: Joi.boolean().default(false),
      includes_maintenance: Joi.boolean().default(true)
    }).optional(),
    discounts: Joi.object({
      type: Joi.string().valid('percentage', 'fixed_amount').optional(),
      value: Joi.number().positive().optional(),
      min_lease_term_days: Joi.number().integer().positive().optional(),
      max_lease_term_days: Joi.number().integer().positive().optional(),
      valid_from: Joi.date().iso().optional(),
      valid_to: Joi.date().iso().optional()
    }).optional()
  }),

  // Update pricing request
  update: Joi.object({
    price: Joi.number().positive().precision(2),
    effective_date: Joi.date().iso(),
    end_date: Joi.date().iso().allow(null),
    min_lease_term_days: Joi.number().integer().positive(),
    max_lease_term_days: Joi.number().integer().positive(),
    terms: Joi.object({
      includes_utilities: Joi.boolean(),
      includes_internet: Joi.boolean(),
      includes_parking: Joi.boolean(),
      includes_cleaning: Joi.boolean(),
      includes_maintenance: Joi.boolean()
    }),
    discounts: Joi.object({
      type: Joi.string().valid('percentage', 'fixed_amount'),
      value: Joi.number().positive(),
      min_lease_term_days: Joi.number().integer().positive(),
      max_lease_term_days: Joi.number().integer().positive(),
      valid_from: Joi.date().iso(),
      valid_to: Joi.date().iso()
    })
  }),

  // Search parameters
  search: Joi.object({
    unit_id: Joi.number().integer().positive(),
    price_type: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly'),
    effective_date_from: Joi.date().iso(),
    effective_date_to: Joi.date().iso()
  }).fork(['unit_id', 'price_type', 'effective_date_from', 'effective_date_to'], schema => schema.optional())
};

module.exports = pricingSchema;
