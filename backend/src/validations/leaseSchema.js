const Joi = require('joi');
const ValidationUtils = require('./baseSchema');

// Lease validation schema
const leaseSchema = {
  // Create lease request
  create: Joi.object({
    customer_id: Joi.number().integer().positive().required(),
    unit_id: Joi.number().integer().positive().required(),
    lease_type: Joi.string().valid('fixed', 'month-to-month', 'short-term', 'long-term').default('fixed'),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
    monthly_rent: Joi.number().positive().precision(2).required(),
    security_deposit: Joi.number().positive().precision(2).optional(),
    terms: Joi.object({
      lease_term_months: Joi.number().integer().positive().optional(),
      auto_renewal: Joi.boolean().default(false),
      notice_period_days: Joi.number().integer().positive().optional(),
      rent_increase_allowed: Joi.boolean().default(false),
      subletting_allowed: Joi.boolean().default(false)
    }).optional(),
    renewal_options: Joi.object({
      option_to_extend: Joi.boolean().default(false),
      extension_term_months: Joi.number().integer().positive().optional(),
      renewal_rent_increase_percent: Joi.number().positive().max(50).optional()
    }).optional(),
    documents: Joi.array().items(Joi.object({
      document_id: Joi.number().integer().positive(),
      document_type: Joi.string().trim().max(100)
    })).optional(),
    status: Joi.string().valid('draft', 'pending', 'active', 'completed', 'terminated', 'cancelled').default('draft'),
    notes: Joi.string().trim().max(2000).optional()
  }),

  // Update lease request
  update: Joi.object({
    lease_type: Joi.string().valid('fixed', 'month-to-month', 'short-term', 'long-term'),
    monthly_rent: Joi.number().positive().precision(2),
    security_deposit: Joi.number().positive().precision(2),
    terms: Joi.object({
      lease_term_months: Joi.number().integer().positive(),
      auto_renewal: Joi.boolean(),
      notice_period_days: Joi.number().integer().positive(),
      rent_increase_allowed: Joi.boolean(),
      subletting_allowed: Joi.boolean()
    }),
    renewal_options: Joi.object({
      option_to_extend: Joi.boolean(),
      extension_term_months: Joi.number().integer().positive(),
      renewal_rent_increase_percent: Joi.number().positive().max(50)
    }),
    notes: Joi.string().trim().max(2000),
    status: Joi.string().valid('draft', 'pending', 'active', 'completed', 'terminated', 'cancelled')
  }),

  // Change lease status
  changeStatus: Joi.object({
    status: Joi.string().valid('draft', 'pending', 'active', 'completed', 'terminated', '').required(),
    reason: Joi.string().trim().max(500).optional()
  }),

  // Renewal request
  renewal: Joi.object({
    new_start_date: Joi.date().iso().required(),
    new_end_date: Joi.date().iso().min(Joi.ref('new_start_date')).required(),
    new_monthly_rent: Joi.number().positive().precision(2).required(),
    renewal_terms: Joi.object({
      rent_increase_percent: Joi.number().positive().max(50).optional(),
      changes_to_terms: Joi.array().items(Joi.object({
        term: Joi.string().trim().max(100),
        old_value: Joi.alternatives().try(Joi.string(), Joi.number()),
        new_value: Joi.alternatives().try(Joi.string(), Joi.number())
      }))
    }).optional()
  }),

  // Termination request
  termination: Joi.object({
    termination_date: Joi.date().iso().required(),
    reason: Joi.string().trim().max(500).required(),
    surrender_condition: Joi.string().valid('good', 'fair', 'poor').optional(),
    security_deposit_refund: Joi.boolean().default(false)
  }),

  // Search parameters
  search: Joi.object({
    search: Joi.string().trim().min(1).max(100),
    status: Joi.string().valid('draft', 'pending', 'active', 'completed', 'terminated', 'cancelled'),
    customer_id: Joi.number().integer().positive(),
    unit_id: Joi.number().integer().positive(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).fork(['search', 'status', 'customer_id', 'unit_id', 'startDate', 'endDate'], schema => schema.optional())
};

module.exports = leaseSchema;
