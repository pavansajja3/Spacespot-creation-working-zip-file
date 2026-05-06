const { Op, where } = require('sequelize');
const config = require('../config/app');

class QueryUtils {
  // Build search query from multiple fields
  static buildSearchQuery(search, fields) {
    if (!search) return {};

    const searchConditions = fields.map(field => ({
      [field]: {
        [Op.iLike]: `%${search}%`
      }
    }));

    return { [Op.or]: searchConditions };
  }

  // Build status filter
  static buildStatusFilter(status) {
    if (!status) return {};

    const statusValues = Array.isArray(status) ? status : [status];
    return {
      status: {
        [Op.in]: statusValues
      }
    };
  }

  // Build date range filter
  static buildDateFilter(field, { startDate, endDate }) {
    const conditions = [];

    if (startDate) {
      conditions.push({ [field]: { [Op.gte]: startDate } });
    }

    if (endDate) {
      conditions.push({ [field]: { [Op.lte]: endDate } });
    }

    if (conditions.length > 0) {
      return { [Op.and]: conditions };
    }

    return {};
  }

  // Build numeric range filter
  static buildNumericFilter(field, { min, max }) {
    const conditions = [];

    if (min !== undefined && min !== null) {
      conditions.push({ [field]: { [Op.gte]: parseFloat(min) } });
    }

    if (max !== undefined && max !== null) {
      conditions.push({ [field]: { [Op.lte]: parseFloat(max) } });
    }

    if (conditions.length > 0) {
      return { [Op.and]: conditions };
    }

    return {};
  }

  // Build entity relationship filter
  static buildEntityFilter(entityId) {
    if (!entityId) return {};
    return { [Op.eq]: entityId };
  }

  // Build pagination options
  static buildPagination(page, limit) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      return { offset: 0, limit: config.DEFAULT_LIMIT };
    }

    if (isNaN(limitNum) || limitNum < 1) {
      return { offset: (pageNum - 1) * config.DEFAULT_LIMIT, limit: config.DEFAULT_LIMIT };
    }

    if (limitNum > config.MAX_LIMIT) {
      return { offset: (pageNum - 1) * config.MAX_LIMIT, limit: config.MAX_LIMIT };
    }

    return { offset: (pageNum - 1) * limitNum, limit: limitNum };
  }

  // Build sorting options
  static buildSorting(sortBy, order = 'DESC') {
    const allowedSortFields = [
      'created_at', 'updated_at', 'deleted_at',
      'id', 'name', 'title', 'email',
      'status', 'type', 'price', 'amount',
      'start_date', 'end_date', 'due_date',
      'first_name', 'last_name', 'phone'
    ];

    // Validate sort field
    const normalizedField = sortBy?.toLowerCase().replace(/-/g, '_');
    if (!normalizedField || !allowedSortFields.includes(normalizedField)) {
      return [['created_at', 'DESC']];
    }

    // Validate order
    const normalizedOrder = order?.toUpperCase();
    if (!['ASC', 'DESC'].includes(normalizedOrder)) {
      return [[normalizedField, 'DESC']];
    }

    return [[normalizedField, normalizedOrder]];
  }

  // Build complex where clause
  static buildComplexWhere(options = {}) {
    const conditions = [];

    // Search
    if (options.search) {
      const searchFields = options.searchFields || ['name', 'title'];
      conditions.push(this.buildSearchQuery(options.search, searchFields));
    }

    // Status
    if (options.status) {
      conditions.push(this.buildStatusFilter(options.status));
    }

    // Date range
    if (options.startDate || options.endDate) {
      conditions.push(this.buildDateFilter(options.dateField || 'created_at', {
        startDate: options.startDate,
        endDate: options.endDate
      }));
    }

    // Numeric range
    if (options.min !== undefined || options.max !== undefined) {
      conditions.push(this.buildNumericFilter(options.numericField || 'price', {
        min: options.min,
        max: options.max
      }));
    }

    // Entity filters
    if (options.entityId) {
      conditions.push(this.buildEntityFilter(options.entityId));
    }

    // Soft delete filter
    const includeSoftDeleted = options.includeSoftDeleted || false;
    if (!includeSoftDeleted) {
      conditions.push({
        deleted_at: null
      });
    }

    return { [Op.and]: conditions };
  }

  // Parse query parameters
  static parseQueryParams(query, fieldMappings = {}) {
    const params = {};

    Object.keys(query).forEach(key => {
      const fieldName = fieldMappings[key] || key;
      const value = query[key];

      // Parse numeric values
      if (['min', 'max', 'limit', 'page'].includes(key) || key.includes('Id')) {
        params[fieldName] = parseFloat(value);
      } else if (key === 'order' || key === 'status') {
        params[fieldName] = value;
      } else {
        params[fieldName] = value;
      }
    });

    return params;
  }

  // Get total count
  static async getCount(Model, whereClause) {
    return Model.count({
      where: whereClause
    });
  }

  // Build include array for associations
  static buildIncludes(includes, attributes = null) {
    if (!includes || includes.length === 0) return [];

    return includes.map(include => {
      if (typeof include === 'string') {
        return {
          model: include,
          attributes
        };
      }

      return {
        ...include,
        attributes: include.attributes || attributes || ['id', ...include.model?.rawAttributes ? Object.keys(include.model.rawAttributes) : []]
      };
    });
  }

  // Get request filters
  static getFilters(req) {
    const {
      search,
      status,
      startDate,
      endDate,
      sortBy,
      order,
      page,
      limit,
      min,
      max,
      ...otherParams
    } = req.query;

    return {
      search,
      status: status ? status.split(',') : status,
      dateRange: { startDate, endDate },
      numericRange: { min: parseFloat(min), max: parseFloat(max) },
      pagination: {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || config.DEFAULT_LIMIT
      },
      sorting: {
        sortBy,
        order: order?.toUpperCase() || 'DESC'
      },
      filters: otherParams
    };
  }
}

module.exports = QueryUtils;
