const Floor = require('../models/Floor');
const Unit = require('../models/Unit');
const Space = require('../models/Space');

class FloorService {
  static async createFloor(data, createdBy) {
    const floor = await Floor.create({
      ...data,
      created_by: createdBy
    });

    await Space.increment('floor_count', {
      where: { id: data.space_id },
      by: 1
    });

    return floor;
  }

  static async getFloorById(id) {
    return Floor.findByPk(id, {
      include: [
        {
          model: Unit,
          as: 'units'
        }
      ],
      paranoid: false
    });
  }

  static async getAllFloors(spaceId, query = {}) {
    const space = await Space.findByPk(spaceId, {
      paranoid: false
    });

    if (!space) {
      throw new Error('Space not found');
    }

    const floors = await Floor.findAll({
      where: {
        space_id: Number(spaceId)
      },
      order: [['id', 'ASC']]
    });

    return floors;
  }

  static async updateFloor(id, data, updatedBy) {
    const floor = await Floor.findByPk(id);

    if (!floor) {
      throw new Error('Floor not found');
    }

    await floor.update({
      ...data,
      updated_by: updatedBy
    });

    return floor;
  }

  static async deleteFloor(id, deletedBy) {
    const floor = await Floor.findByPk(id);

    if (!floor) {
      throw new Error('Floor not found');
    }

    const unitCount = await Unit.count({
      where: { floor_id: id }
    });

    if (unitCount > 0) {
      throw new Error('Cannot delete floor with existing units');
    }

    await floor.update({
      deleted_at: new Date(),
      deleted_by: deletedBy
    });

    return { message: 'Floor deleted successfully' };
  }
}

module.exports = FloorService;