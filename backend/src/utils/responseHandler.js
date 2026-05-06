class ResponseHandler {
  // Success response
  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  // Created response
  static created(res, message, data = null) {
    return this.success(res, message, data, 201);
  }

  // No content response
  static noContent(res) {
    return res.status(204).json({});
  }

  // Error response
  static error(res, message, statusCode = 500, error = null) {
    const response = {
      success: false,
      message,
      statusCode
    };

    if (error) {
      response.error = {
        name: error.name,
        message: error.message
      };
    }

    return res.status(statusCode).json(response);
  }

  // Bad request response
  static badRequest(res, message, errors = null) {
    const response = {
      success: false,
      message,
      statusCode: 400
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(400).json(response);
  }

  // Unauthorized response
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  // Forbidden response
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  // Not found response
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  // Conflict response
  static conflict(res, message = 'Conflict') {
    return this.error(res, message, 409);
  }

  // Validation error response
  static validationError(res, errors) {
    return this.badRequest(res, 'Validation failed', errors);
  }

  // Rate limit response
  static rateLimit(res, message = 'Too many requests') {
    return this.error(res, message, 429);
  }

  // Server error response
  static serverError(res, message = 'Internal server error', error = null) {
    return this.error(res, message, 500, error);
  }

  // Paginated response
  static paginated(res, data, pagination, message = 'Success') {
    return this.success(res, message, {
      items: data.rows || data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.count,
        total_pages: Math.ceil(pagination.count / pagination.limit)
      }
    });
  }

  // Empty response
  static empty(res, message = 'Success') {
    return this.success(res, message, null);
  }

  // Delete response
  static deleted(res, message = 'Successfully deleted') {
    return this.success(res, message);
  }

  // Updated response
  static updated(res, message = 'Successfully updated', data = null) {
    return this.success(res, message, data);
  }

  // Created response
  static created(res, message = 'Successfully created', data = null) {
    return this.success(res, message, data, 201);
  }

  // Get response format
  static getResponseFormat(type) {
    const formats = {
      success: {
        success: 'boolean',
        message: 'string',
        data: 'object|null'
      },
      error: {
        success: 'boolean',
        message: 'string',
        statusCode: 'number',
        error: 'object'
      },
      validation: {
        success: 'boolean',
        message: 'string',
        statusCode: 'number',
        errors: 'array'
      },
      paginated: {
        success: 'boolean',
        message: 'string',
        data: {
          items: 'array',
          pagination: {
            page: 'number',
            limit: 'number',
            total: 'number',
            total_pages: 'number'
          }
        }
      }
    };

    return formats[type];
  }
}

module.exports = ResponseHandler;
