const Joi = require('joi');
const ValidationUtils = require('./baseSchema');

// Space validation schema
const spaceSchema = {
  // Create space request
  create: Joi.object({
    name: Joi.string().trim().min(1).max(200).required(),
    building_type: Joi.string().trim().min(1).max(100).optional(),
    building_class: Joi.string().valid('A', 'B', 'C', 'D').optional(),
    address: Joi.object({
      street: Joi.string().trim().min(1).max(255).required(),
      city: Joi.string().trim().min(1).max(100).required(),
      state: Joi.string().trim().min(1).max(100).required(),
      postal_code: Joi.string().trim().min(3).max(20).required(),
      country: Joi.string().trim().min(2).max(100).required()
    }).required(),
    total_area: Joi.number().positive().integer().optional(),
    description: Joi.string().trim().max(5000).optional(),
    features: Joi.array().items(Joi.string().trim().max(200)).optional(),
    amenities: Joi.array().items(Joi.string().trim().max(200)).optional(),
    status: Joi.string().valid('draft', 'active', 'maintenance', 'inactive', 'archived').default('draft'),
    metadata: Joi.object().optional()
  }),

  // Update space request
  update: Joi.object({
    name: Joi.string().trim().min(1).max(200),
    building_type: Joi.string().trim().min(1).max(100),
    building_class: Joi.string().valid('A', 'B', 'C', 'D'),
    address: Joi.object({
      street: Joi.string().trim().min(1).max(255),
      city: Joi.string().trim().min(1).max(100),
      state: Joi.string().trim().min(1).max(100),
      postal_code: Joi.string().trim().min(3).max(20),
      country: Joi.string().trim().min(2).max(100)
    }),
    total_area: Joi.number().positive().integer(),
    description: Joi.string().trim().max(5000),
    features: Joi.array().items(Joi.string().trim().max(200)),
    amenities: Joi.array().items(Joi.string().trim().max(200)),
    status: Joi.string().valid('draft', 'active', 'maintenance', 'inactive', 'archived')
  }),

  // Add floor
  addFloor: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    floor_number: Joi.number().integer().required(),
    total_area: Joi.number().positive().integer(),
    description: Joi.string().trim().max(500).optional()
  }),

  // Search parameters
  search: Joi.object({
    search: Joi.string().trim().min(1).max(100),
    building_class: Joi.string().valid('A', 'B', 'C', 'D'),
    status: Joi.string().valid('draft', 'active', 'maintenance', 'inactive', 'archived'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).fork(['search', 'building_class', 'status', 'startDate', 'endDate'], schema => schema.optional())
};

module.exports = spaceSchema;
