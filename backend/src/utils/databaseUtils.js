const { Op, fn, col } = require('sequelize');
const { QueryUtils } = require('./queryUtils');
const config = require('../config/app');

class DatabaseHelper {
  // Get all records with pagination
  static async findAll(Model, options = {}) {
    const {
      page = 1,
      limit = config.DEFAULT_LIMIT,
      search,
      status,
      startDate,
      endDate,
      sortBy = 'created_at',
      order = 'DESC',
      where: customWhere = {},
      includes = [],
      attributes = null
    } = options;

    const pagination = QueryUtils.buildPagination(page, limit);
    const sorting = QueryUtils.buildSorting(sortBy, order);
    const whereClause = QueryUtils.buildComplexWhere({
      search,
      status,
      startDate,
      endDate,
      dateField: 'created_at',
      ...customWhere
    });

    const findOptions = {
      where: whereClause,
      ...pagination,
      order: sorting,
      include: QueryUtils.buildIncludes(includes, attributes),
      attributes: attributes || Model.rawAttributes
    };

    return Model.findAndCountAll(findOptions);
  }

  // Find by ID
  static async findById(Model, id, includes = [], attributes = null) {
    const includeList = QueryUtils.buildIncludes(includes, attributes);
    
    const record = await Model.findByPk(id, {
      include: includeList,
      attributes: attributes || Model.rawAttributes,
      paranoid: false // Disable soft delete for findById
    });

    if (!record) {
      throw new Error(`${Model.name} not found`);
    }

    return record;
  }

  // Find by conditions
  static async findByConditions(Model, whereClause, options = {}) {
    const {
      limit = 1,
      order = [['created_at', 'DESC']],
      attributes = null,
      includes = []
    } = options;

    return Model.findAll({
      where: whereClause,
      limit,
      order,
      include: QueryUtils.buildIncludes(includes, attributes),
      attributes: attributes || Model.rawAttributes
    });
  }

  // Count records
  static async count(Model, whereClause = {}) {
    return Model.count({
      where: whereClause
    });
  }

  // Check if record exists
  static async exists(Model, whereClause) {
    const count = await Model.count({
      where: whereClause
    });
    return count > 0;
  }

  // Get first record
  static async first(Model, whereClause, options = {}) {
    const {
      order = [['created_at', 'DESC']],
      attributes = null,
      includes = []
    } = options;

    return Model.findOne({
      where: whereClause,
      order,
      include: QueryUtils.buildIncludes(includes, attributes),
      attributes: attributes || Model.rawAttributes
    });
  }

  // Bulk create
  static async bulkCreate(Model, records, options = {}) {
    const {
      validate = false,
      ignoreDuplicates = false,
      updateOnDuplicate = []
    } = options;

    return Model.bulkCreate(records, {
      validate,
      ignoreDuplicates,
      updateOnDuplicate,
      individualHooks: true
    });
  }

  // Bulk update
  static async bulkUpdate(Model, whereClause, data, options = {}) {
    const {
      hooks = true,
      validate = false,
      force = false
    } = options;

    return Model.update(data, {
      where: whereClause,
      hooks,
      validate,
      force,
      returning: true
    });
  }

  // Bulk delete
  static async bulkDelete(Model, whereClause, options = {}) {
    const {
      hooks = true,
      force = false,
      individualHooks = false
    } = options;

    return Model.destroy({
      where: whereClause,
      hooks,
      force,
      individualHooks
    });
  }

  // Find with subquery
  static async findWithSubquery(Model, mainQuery, options = {}) {
    const {
      include = [],
      attributes = null,
      order = [['created_at', 'DESC']],
      limit,
      offset
    } = options;

    return Model.findAndCountAll({
      where: mainQuery.where,
      include: QueryUtils.buildIncludes(include, attributes),
      attributes: attributes || Model.rawAttributes,
      order,
      limit,
      offset
    });
  }

  // Get records with date grouping
  static async getDailyStats(Model, dateField, whereClause = {}, options = {}) {
    const {
      startDate,
      endDate,
      model = Model,
      where: customWhere = {}
    } = options;

    const fullWhere = {
      ...whereClause,
      ...customWhere
    };

    const stats = await model.findAll({
      attributes: [
        [fn('DATE', col(dateField)), 'date'],
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('amount')), 'total'],
        [fn('AVG', col('amount')), 'average']
      ],
      where: fullWhere,
      group: [fn('DATE', col(dateField))],
      order: [[fn('DATE', col(dateField)), 'ASC']]
    });

    return stats.map(stat => ({
      date: stat.get('date'),
      count: stat.get('count'),
      total: parseFloat(stat.get('total')) || 0,
      average: parseFloat(stat.get('average')) || 0
    }));
  }

  // Get records with status grouping
  static async getStatusStats(Model, statusField, whereClause = {}) {
    const stats = await Model.findAll({
      attributes: [
        [col(statusField), 'status'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: whereClause,
      group: [statusField]
    });

    return stats.reduce((acc, stat) => {
      const status = stat.get(statusField);
      const count = stat.get('count');
      acc[status] = count;
      return acc;
    }, {});
  }

  // Get records with date range
  static async getRecordsByDateRange(Model, dateField, { startDate, endDate }, whereClause = {}) {
    const dateWhere = QueryUtils.buildDateFilter(dateField, { startDate, endDate });
    
    return Model.findAll({
      where: {
        [Op.and]: [
          whereClause,
          dateWhere
        ]
      },
      order: [[dateField, 'ASC']]
    });
  }

  // Get records with soft delete
  static async findWithSoftDelete(Model, whereClause, options = {}) {
    const {
      include = [],
      attributes = null,
      order = [['deleted_at', 'DESC']]
    } = options;

    return Model.findAll({
      where: whereClause,
      paranoid: false,
      include: QueryUtils.buildIncludes(include, attributes),
      attributes: attributes || Model.rawAttributes,
      order
    });
  }

  // Execute raw query
  static async query(Model, sql, options = {}) {
    const {
      replacements = [],
      type = 'SELECT',
      raw = true
    } = options;

    return Model.query(sql, {
      replacements,
      type,
      raw
    });
  }

  // Transaction wrapper
  static async transaction(fn, options = {}) {
    return Model.sequelize.transaction({
      isolationLevel: config.TRANSACTION_ISOLATION_LEVEL || 'REPEATABLE_READ',
      ...options
    }, async (transaction) => {
      return fn(transaction);
    });
  }

  // Get distinct values
  static async getDistinctValues(Model, field, whereClause = {}) {
    const results = await Model.findAll({
      attributes: [[fn('DISTINCT', col(field)), field]],
      where: whereClause,
      raw: true
    });

    return results.map(r => r[field]);
  }

  // Get last record
  static async getLast(Model, whereClause = {}, options = {}) {
    const {
      order = [['created_at', 'DESC']],
      include = [],
      attributes = null
    } = options;

    return Model.findOne({
      where: whereClause,
      order,
      include: QueryUtils.buildIncludes(include, attributes),
      attributes: attributes || Model.rawAttributes
    });
  }

  // Get first N records
  static async getLatest(Model, count, options = {}) {
    const {
      order = [['created_at', 'DESC']],
      include = [],
      attributes = null
    } = options;

    return Model.findAll({
      limit: count,
      order,
      include: QueryUtils.buildIncludes(include, attributes),
      attributes: attributes || Model.rawAttributes
    });
  }

  // Search with pagination
  static async search(Model, searchQuery, options = {}) {
    const {
      page = 1,
      limit = config.DEFAULT_LIMIT,
      searchFields = ['name', 'title'],
      include = [],
      attributes = null
    } = options;

    const pagination = QueryUtils.buildPagination(page, limit);
    const searchClause = QueryUtils.buildSearchQuery(searchQuery, searchFields);
    const sorting = QueryUtils.buildSorting('created_at');

    const findOptions = {
      where: searchClause,
      ...pagination,
      order: sorting,
      include: QueryUtils.buildIncludes(include, attributes),
      attributes: attributes || Model.rawAttributes
    };

    return Model.findAndCountAll(findOptions);
  }
}

module.exports = DatabaseHelper;
