const Joi = require('joi');

// Main validation middleware
class ValidationMiddleware {
  // Validate request body
  static validateBody(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.value
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      req.validatedBody = value;
      next();
    };
  }

  // Validate query parameters
  static validateQuery(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.value
        }));

        return res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors
        });
      }

      req.validatedQuery = value;
      next();
    };
  }

  // Validate request parameters
  static validateParams(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.value
        }));

        return res.status(400).json({
          success: false,
          message: 'Parameters validation failed',
          errors
        });
      }

      req.validatedParams = value;
      next();
    };
  }

  // Validate headers
  static validateHeaders(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.headers, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.value
        }));

        return res.status(400).json({
          success: false,
          message: 'Headers validation failed',
          errors
        });
      }

      req.validatedHeaders = value;
      next();
    };
  }

  // Validate entire request
  static validate(schema = {}) {
    const { body, query, params, headers } = schema;

    return [
      body && this.validateBody(body),
      query && this.validateQuery(query),
      params && this.validateParams(params),
      headers && this.validateHeaders(headers)
    ].filter(Boolean);
  }

  // Validate file upload
  static validateFileUpload(schema) {
    return (req, res, next) => {
      if (!req.file && !req.files) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const file = req.file || (req.files && req.files[0]);

      const { error } = schema.validate(file, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.value
        }));

        return res.status(400).json({
          success: false,
          message: 'File validation failed',
          errors
        });
      }

      req.validatedFile = file;
      next();
    };
  }

  // Validate pagination
  static validatePagination(schema) {
    return (req, res, next) => {
      const result = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (result.error) {
        const errors = result.error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.value
        }));

        return res.status(400).json({
          success: false,
          message: 'Pagination validation failed',
          errors
        });
      }

      req.validatedPagination = result.value;
      next();
    };
  }

  // Validate search parameters
  static validateSearch(schema) {
    return (req, res, next) => {
      const result = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (result.error) {
        const errors = result.error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.value
        }));

        return res.status(400).json({
          success: false,
          message: 'Search validation failed',
          errors
        });
      }

      req.validatedSearch = result.value;
      next();
    };
  }

  // Validate array items
  static validateArrayItems(schema, fieldName = 'items') {
    return (req, res, next) => {
      const array = req.body[fieldName] || req.validatedBody?.[fieldName];

      if (!array || !Array.isArray(array)) {
        return res.status(400).json({
          success: false,
          message: `${fieldName} must be an array`
        });
      }

      const errors = [];

      array.forEach((item, index) => {
        const { error } = schema.validate(item, {
          abortEarly: false,
          stripUnknown: true
        });

        if (error) {
          error.details.forEach(detail => {
            errors.push({
              field: `${fieldName}[${index}].${detail.path.join('.')}`,
              message: detail.message,
              value: detail.value
            });
          });
        }
      });

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Array validation failed',
          errors
        });
      }

      req.validatedArrayItems = array;
      next();
    };
  }
}

module.exports = ValidationMiddleware;
