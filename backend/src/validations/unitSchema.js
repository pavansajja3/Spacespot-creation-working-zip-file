const Joi = require('joi');
const ValidationUtils = require('./baseSchema');

// Unit validation schema
const unitSchema = {
  // Create unit request
  create: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    unit_number: Joi.string().trim().min(1).max(50).required(),
    floor_id: Joi.number().integer().positive().required(),
    space_id: Joi.number().integer().positive().required(),
    total_area: Joi.number().positive().integer().required(),
    description: Joi.string().trim().max(1000).optional(),
    features: Joi.array().items(Joi.string().trim().max(200)).optional(),
    status: Joi.string().valid('available', 'occupied', 'maintenance', 'reserved', 'archived').default('available'),
    metadata: Joi.object().optional()
  }),

  // Update unit request
  update: Joi.object({
    name: Joi.string().trim().min(1).max(100),
    unit_number: Joi.string().trim().min(1).max(50),
    total_area: Joi.number().positive().integer(),
    description: Joi.string().trim().max(1000),
    features: Joi.array().items(Joi.string().trim().max(200)),
    status: Joi.string().valid('available', 'occupied', 'maintenance', 'reserved', 'archived')
  }),

  // Change occupancy status
  changeStatus: Joi.object({
    status: Joi.string().valid('available', 'occupied', 'maintenance', 'reserved', 'archived').required(),
    reason: Joi.string().trim().max(500).optional()
  }),

  // Add unit photo
  addPhoto: Joi.object({
    photo_url: Joi.string().uri().required(),
    description: Joi.string().trim().max(200).optional(),
    is_primary: Joi.boolean().default(false)
  }),

  // Search parameters
  search: Joi.object({
    search: Joi.string().trim().min(1).max(100),
    status: Joi.string().valid('available', 'occupied', 'maintenance', 'reserved', 'archived'),
    floor_id: Joi.number().integer().positive(),
    space_id: Joi.number().integer().positive(),
    available_only: Joi.boolean()
  }).fork(['search', 'status', 'floor_id', 'space_id', 'available_only'], schema => schema.optional())
};

module.exports = unitSchema;
