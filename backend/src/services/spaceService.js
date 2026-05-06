const { Op } = require("sequelize");
const { Space, Unit, Floor } = require("../models");

class SpaceService {
  static async createSpace(data, createdBy) {
    const spaceReference = `SPC-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    const space = await Space.create({
      ...data,
      images: data.images || [],
      documents: data.documents || [],
      status: "pending",
      space_reference: spaceReference,
      created_by: createdBy
    });

    if (Array.isArray(data.floors)) {
      for (const floorData of data.floors) {
        const floor = await Floor.create({
          ...floorData,
          space_id: space.id
        });

        if (Array.isArray(floorData.units)) {
          for (const unitData of floorData.units) {
            await Unit.create({
              ...unitData,
              floor_id: floor.id
            });
          }
        }
      }
    }

    return await this.getSpaceById(space.id);
  }

  static async getSpaceById(id) {
    const space = await Space.findByPk(id, {
      include: [
        {
          model: Floor,
          as: "floors",
          include: [
            {
              model: Unit,
              as: "units"
            }
          ]
        }
      ],
      paranoid: false
    });

    if (!space) return null;

    const data = space.toJSON();

    return {
      ...data,

      floor_count: data.floors ? data.floors.length : 0,

      total_units: data.floors
        ? data.floors.reduce(
            (sum, floor) => sum + (floor.units ? floor.units.length : 0),
            0
          )
        : 0
    };
  }

  static async getAllSpaces(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      city,
      sortBy = "createdAt",
      order = "DESC"
    } = query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (search) {
      where[Op.or] = [
        { space_reference: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) where.status = status;
    if (city) where.city = city;

    const { count, rows } = await Space.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order]],
      include: [
        {
          model: Floor,
          as: "floors",
          include: [
            {
              model: Unit,
              as: "units",
              attributes: ["id"]
            }
          ]
        }
      ],
      distinct: true,
      paranoid: false
    });

    const spaces = rows.map((space) => {
      const data = space.toJSON();

            return {
        ...data,

        floor_count: data.floors ? data.floors.length : 0,

        total_units: data.floors
          ? data.floors.reduce(
              (sum, floor) => sum + (floor.units ? floor.units.length : 0),
              0
            )
          : 0
      };
    });

    return {
      spaces,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      }
    };
  }

  static async updateSpace(id, data, updatedBy) {
    const space = await Space.findByPk(id);
    if (!space) throw new Error("Space not found");

    await space.update({
      ...data,
      updated_by: updatedBy
    });

    return space;
  }

  static async deleteSpace(id, deletedBy) {
    const space = await Space.findByPk(id);
    if (!space) throw new Error("Space not found");

    await space.update({
      deleted_at: new Date(),
      deleted_by: deletedBy
    });

    return { message: "Space deleted successfully" };
  }

  static async getSpaceStatistics() {
    const totalSpaces = await Space.count({ where: { deleted_at: null } });
    const pendingSpaces = await Space.count({ where: { status: "pending", deleted_at: null } });
    const approvedSpaces = await Space.count({ where: { status: "approved", deleted_at: null } });
    const rejectedSpaces = await Space.count({ where: { status: "rejected", deleted_at: null } });
    const totalUnits = await Unit.count();

    return {
      totalSpaces,
      pendingSpaces,
      approvedSpaces,
      rejectedSpaces,
      totalUnits
    };
  }
}

module.exports = SpaceService;