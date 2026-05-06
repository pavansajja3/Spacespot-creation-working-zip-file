const Joi = require('joi');
const ValidationUtils = require('./baseSchema');

// User/Authentication validation schema
const userSchema = {
  // Register request
  register: Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(100).required(),
    first_name: Joi.string().trim().min(1).max(100).required(),
    last_name: Joi.string().trim().min(1).max(100).required(),
    phone: Joi.string().trim().min(8).max(20).optional(),
    role: Joi.string().valid('admin', 'staff', 'user', 'customer', 'tenant').default('user'),
    company: Joi.string().trim().min(1).max(200).optional()
  }),

  // Login request
  login: Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().required(),
    remember_me: Joi.boolean().default(false)
  }),

  // Change password
  changePassword: Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(8).max(100).required(),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
  }),

  // Reset password
  resetPassword: Joi.object({
    token: Joi.string().required(),
    new_password: Joi.string().min(8).max(100).required(),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
  }),

  // Update profile
  updateProfile: Joi.object({
    first_name: Joi.string().trim().min(1).max(100),
    last_name: Joi.string().trim().min(1).max(100),
    phone: Joi.string().trim().min(8).max(20),
    company: Joi.string().trim().min(1).max(200),
    avatar_url: Joi.string().uri().optional(),
    language: Joi.string().trim().max(10).optional(),
    timezone: Joi.string().trim().max(100).optional()
  }),

  // Search parameters
  search: Joi.object({
    search: Joi.string().trim().min(1).max(100),
    role: Joi.string().valid('admin', 'staff', 'user', 'customer', 'tenant'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).fork(['search', 'role', 'startDate', 'endDate'], schema => schema.optional())
};

module.exports = userSchema;
