const { Op } = require('sequelize');
const Unit = require('../models/Unit');
const Floor = require('../models/Floor');
const Lease = require('../models/Lease');

class UnitService {
  static async createUnit(data, createdBy) {
    const unit = await Unit.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      created_by: createdBy
    });

    // Update floor total units
    await Floor.increment('total_units', {
      where: { id: data.floor_id },
      by: 1
    });

    return unit;
  }

  static async getUnitById(id) {
    return Unit.findByPk(id, {
      include: [{
        model: Floor,
        as: 'floor',
        include: [{
          model: require('../models/Space'),
          as: 'space'
        }]
      }],
      paranoid: false
    });
  }

  static async getAllUnits(query = {}) {
    const {
      page = 1,
      limit = 20,
      occupancy_status,
      floor_id,
      space_id,
      search,
      sortBy = 'id',
      order = 'DESC'
    } = query;

    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (occupancy_status) {
      where.occupancy_status = occupancy_status;
    }
    if (floor_id) {
      where.floor_id = floor_id;
    }
    if (space_id) {
  const floors = await Floor.findAll({
    attributes: ['id'],
    where: { space_id }
  });

  where.floor_id = {
    [Op.in]: floors.map(f => f.id)
  };
}
    if (search) {
      where.unit_number = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Unit.findAndCountAll({
      where,
      include: [{
        model: Floor,
        as: 'floor',
        include: [{
          model: require('../models/Space'),
          as: 'space',
          attributes: ['id', 'name']
        }]
      }],
      limit,
      offset,
      order: [[sortBy, order]],
      paranoid: false
    });

    return {
      units: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  static async updateUnit(id, data, updatedBy) {
    const unit = await Unit.findByPk(id);
    if (!unit) {
      throw new Error('Unit not found');
    }

    await unit.update({
      ...data,
      updated_by: updatedBy
    });

    return unit;
  }

  static async deleteUnit(id, deletedBy) {
    const unit = await Unit.findByPk(id);
    if (!unit) {
      throw new Error('Unit not found');
    }

    // Check if unit has active leases
    const activeLeaseCount = await Lease.count({
      where: {
        unit_id: id,
        status: 'active'
      }
    });

    if (activeLeaseCount > 0) {
      throw new Error('Cannot delete unit with active leases');
    }

    await unit.update({
      deleted_at: new Date(),
      deleted_by: deletedBy
    });

    return { message: 'Unit deleted successfully' };
  }

  static async getAvailableUnits(floorId = null) {
  const where = {
    occupancy_status: 'available'
  };

  if (floorId) {
    where.floor_id = floorId;
  }

  return Unit.findAll({
    where,
    include: [
      {
        model: Floor,
        as: 'floor',
        attributes: ['id', 'floor_name', 'floor_number', 'space_id'],
        include: [
          {
            model: require('../models/Space'),
            as: 'space',
            attributes: ['id', 'name']
          }
        ]
      }
    ],
    order: [['id', 'ASC']]
  });
}

  static async reserveUnit(unitId, customerId) {
    const unit = await Unit.findByPk(unitId);
    if (!unit) {
      throw new Error('Unit not found');
    }

    if (unit.occupancy_status !== 'available') {
      throw new Error('Unit is not available');
    }

    await unit.update({
      occupancy_status: 'reserved'
    });

    return unit;
  }

  static async releaseUnit(unitId) {
    const unit = await Unit.findByPk(unitId);
    if (!unit) {
      throw new Error('Unit not found');
    }

    if (unit.occupancy_status !== 'reserved') {
      throw new Error('Unit is not reserved');
    }

    await unit.update({
      occupancy_status: 'available'
    });

    return unit;
  }
}

module.exports = UnitService;
