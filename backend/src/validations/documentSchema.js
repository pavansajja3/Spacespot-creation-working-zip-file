const Joi = require('joi');
const ValidationUtils = require('./baseSchema');

// Document validation schema
const documentSchema = {
  // Create document request
  create: Joi.object({
    document_type: Joi.string().trim().min(1).max(100).required(),
    title: Joi.string().trim().min(1).max(255).required(),
    description: Joi.string().trim().max(1000).optional(),
    lease_id: Joi.number().integer().positive().optional(),
    unit_id: Joi.number().integer().positive().optional(),
    customer_id: Joi.number().integer().positive().optional(),
    document_category: Joi.string().valid('contract', 'agreement', 'invoice', 'receipt', 'notice', 'certificate', 'other').optional(),
    status: Joi.string().valid('draft', 'pending_review', 'approved', 'rejected', 'active', 'archived').default('draft'),
    document_date: Joi.date().iso().required(),
    expiration_date: Joi.date().iso().allow(null),
    metadata: Joi.object().optional()
  }),

  // Update document request
  update: Joi.object({
    title: Joi.string().trim().min(1).max(255),
    description: Joi.string().trim().max(1000),
    status: Joi.string().valid('draft', 'pending_review', 'approved', 'rejected', 'active', 'archived'),
    document_date: Joi.date().iso(),
    expiration_date: Joi.date().iso().allow(null)
  }),

  // Upload document
  uploadDocument: Joi.object({
    filename: Joi.string().trim().min(1).max(255).required(),
    mime_type: Joi.string().trim().max(100).required(),
    size: Joi.number().integer().positive().required(),
    checksum: Joi.string().trim().min(1).max(100).required()
  }),

  // Review document
  reviewDocument: Joi.object({
    status: Joi.string().valid('approved', 'rejected').required(),
    review_notes: Joi.string().trim().max(1000).required(),
    reviewer_id: Joi.number().integer().positive().optional()
  }),

  // Search parameters
  search: Joi.object({
    search: Joi.string().trim().min(1).max(100),
    document_type: Joi.string().trim().max(100),
    document_category: Joi.string().valid('contract', 'agreement', 'invoice', 'receipt', 'notice', 'certificate', 'other'),
    status: Joi.string().valid('draft', 'pending_review', 'approved', 'rejected', 'active', 'archived'),
    lease_id: Joi.number().integer().positive(),
    unit_id: Joi.number().integer().positive(),
    customer_id: Joi.number().integer().positive(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).fork(['search', 'document_type', 'document_category', 'status', 'lease_id', 'unit_id', 'customer_id', 'startDate', 'endDate'], schema => schema.optional())
};

module.exports = documentSchema;
