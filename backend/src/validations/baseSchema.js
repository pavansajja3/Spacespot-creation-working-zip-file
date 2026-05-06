const Joi = require('joi');

class ValidationUtils {
  // Pagination parameters
  static paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  });

  // Search parameters
  static searchSchema = Joi.object({
    search: Joi.string().trim().min(1).max(100)
  });

  // Status filter
  static statusSchema = Joi.alternatives().try(
    Joi.string().valid('active', 'inactive', 'pending', 'approved', 'rejected'),
    Joi.array().items(Joi.string().valid('active', 'inactive', 'pending', 'approved', 'rejected'))
  );

  // Date range
  static dateRangeSchema = Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().max(Joi.ref('startDate'))
  });

  // Numeric range
  static numericRangeSchema = Joi.object({
    min: Joi.number().min(0),
    max: Joi.number().min(0).when('min', { is: Joi.exist(), then: Joi.gte(Joi.ref('min')) })
  });
}

module.exports = ValidationUtils;
