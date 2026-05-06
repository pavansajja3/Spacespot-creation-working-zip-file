const ResponseHandler = require('../utils/responseHandler');

class ValidationErrorHandler {
  // Handle validation errors
  static handleValidationErrors(req, res, next) {
    const { error } = req.validationError;

    if (!error) {
      return next();
    }

    // Format error details
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.value
    }));

    return ResponseHandler.validationError(res, errors);
  }

  // Handle validation for single field
  static validateField(value, schema, fieldName) {
    const result = schema.validate(value, {
      abortEarly: false,
      stripUnknown: true
    });

    if (result.error) {
      const errors = result.error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.value
      }));

      return { valid: false, errors };
    }

    return { valid: true, data: result.value };
  }

  // Handle validation for array items
  static validateArray(array, itemSchema) {
    const errors = [];

    array.forEach((item, index) => {
      const result = itemSchema.validate(item, {
        abortEarly: false,
        stripUnknown: true
      });

      if (result.error) {
        result.error.details.forEach(detail => {
          errors.push({
            field: `${index}.${detail.path.join('.')}`,
            message: detail.message,
            value: detail.value
          });
        });
      }
    });

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, data: array };
  }

  // Create validation middleware
  static createValidation(schema) {
    return (req, res, next) => {
      // Get validation schema
      const validationSchema = typeof schema === 'function' ? schema(req) : schema;

      // Validate request body
      const result = validationSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
        context: {
          userId: req.user?.id,
          userRole: req.user?.role
        }
      });

      if (result.error) {
        // Attach error to request for handler
        req.validationError = result.error;
        return next();
      }

      // Validate query parameters
      const queryResult = validationSchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (queryResult.error) {
        req.validationError = queryResult.error;
        return next();
      }

      // Validate params
      const paramResult = validationSchema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true
      });

      if (paramResult.error) {
        req.validationError = paramResult.error;
        return next();
      }

      // Attach validated data to request
      req.validatedData = result.value;
      next();
    };
  }

  // Handle database validation errors
  static handleDatabaseErrors(error, req, res, next) {
    // PostgreSQL constraint errors
    if (error.code === '23505') {
      // Unique constraint violation
      return ResponseHandler.conflict(res, 'Record already exists');
    }

    if (error.code === '23503') {
      // Foreign key constraint violation
      return ResponseHandler.badRequest(res, 'Referenced record does not exist');
    }

    if (error.code === '23502') {
      // Not null constraint violation
      return ResponseHandler.badRequest(res, 'Required field is missing');
    }

    if (error.code === '23514') {
      // Check constraint violation
      return ResponseHandler.badRequest(res, 'Invalid value provided');
    }

    // Validation errors
    if (error.name === 'ValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return ResponseHandler.validationError(res, errors);
    }

    // Call next error handler if not handled
    next(error);
  }

  // Handle permission errors
  static handlePermissionError(req, res, next) {
    if (req.permissionDenied) {
      return ResponseHandler.forbidden(res, 'You do not have permission to perform this action');
    }

    next();
  }

  // Handle file upload errors
  static handleFileUploadError(error, req, res, next) {
    if (error.message === 'LIMIT_FILE_SIZE') {
      return ResponseHandler.badRequest(res, 'File size exceeds maximum limit');
    }

    if (error.message === 'UNEXPECTED_FIELD') {
      return ResponseHandler.badRequest(res, 'Unexpected file field');
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return ResponseHandler.badRequest(res, 'Too many files');
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return ResponseHandler.badRequest(res, 'Too many files');
    }

    next(error);
  }
}

module.exports = ValidationErrorHandler;
