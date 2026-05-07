const SpaceService = require("../services/spaceService");

class SpaceController {
  // GET /api/spaces - Get all spaces with filters
  static async getAllSpaces(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        city,
        spaceType,
        buildingClass,
        sortBy = "created_at",
        order = "DESC",
      } = req.query;

      const result = await SpaceService.getAllSpaces({
  page: parseInt(page, 10),
  limit: parseInt(limit, 10),
  search,
  status,
  city,
  spaceType,
  buildingClass,
  sortBy,
  order,
});

// handle different response formats
const spacesArray =
  result?.spaces ||
  result?.data?.spaces ||
  result?.data ||
  result ||
  [];

const updatedSpaces = spacesArray.map((space) => {
  const totalUnits = Number(
    space.total_units ||
    space.units_count ||
    space.units ||
    0
  );

  const availableUnits = Number(
    space.available_units ||
    space.availableUnits ||
    space.available_units_count ||
    0
  );

  const occupancy =
    totalUnits > 0
      ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100)
      : 0;

  return {
    ...space,
    total_units: totalUnits,
    available_units: availableUnits,
    occupancy,
  };
});

res.json({
  success: true,
  data: {
    spaces: updatedSpaces,
  },
});
    } catch (error) {
      console.error("Error in getAllSpaces:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch spaces",
        error: error.message,
      });
    }
  }

  // GET /api/spaces/public - Public should only see approved spaces
  static async getPublicSpaces(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        city,
        spaceType,
        buildingClass,
        sortBy = "created_at",
        order = "DESC",
      } = req.query;

      const spaces = await SpaceService.getAllSpaces({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search,
        status: "approved",
        city,
        spaceType,
        buildingClass,
        sortBy,
        order,
      });

      res.json({
        success: true,
        data: spaces,
      });
    } catch (error) {
      console.error("Error in getPublicSpaces:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch public spaces",
        error: error.message,
      });
    }
  }

  // GET /api/spaces/:id - Get space by ID
  static async getSpaceById(req, res) {
    try {
      const { id } = req.params;
      const space = await SpaceService.getSpaceById(id);

      if (!space) {
        return res.status(404).json({
          success: false,
          message: "Space not found",
        });
      }

      res.json({
        success: true,
        data: space,
      });
    } catch (error) {
      console.error("Error in getSpaceById:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch space",
        error: error.message,
      });
    }
  }

  // POST /api/spaces - Create new space
  static async createSpace(req, res) {
    try {
      const body = {
        ...req.body,
        status: req.body.status || "pending",
      };

      const userId = req.user?.id || req.body.created_by || null;

      const space = await SpaceService.createSpace(body, userId);

      res.status(201).json({
        success: true,
        message: "Space created successfully",
        data: space,
      });
    } catch (error) {
      console.error("Error in createSpace:", error);

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          success: false,
          message: "Space with this reference already exists",
        });
      }

      res.status(400).json({
        success: false,
        message: "Failed to create space",
        error: error.message,
      });
    }
  }

  // PUT /api/spaces/:id - Update space
  static async updateSpace(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.updated_by || null;

      const space = await SpaceService.updateSpace(id, req.body, userId);

      if (!space) {
        return res.status(404).json({
          success: false,
          message: "Space not found",
        });
      }

      res.json({
        success: true,
        message: "Space updated successfully",
        data: space,
      });
    } catch (error) {
      console.error("Error in updateSpace:", error);
      res.status(400).json({
        success: false,
        message: "Failed to update space",
        error: error.message,
      });
    }
  }

  // DELETE /api/spaces/:id - Soft delete space
  static async deleteSpace(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || null;

      await SpaceService.deleteSpace(id, userId);

      res.json({
        success: true,
        message: "Space deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteSpace:", error);
      res.status(400).json({
        success: false,
        message: "Failed to delete space",
        error: error.message,
      });
    }
  }

  // PUT /api/spaces/:id/change-status - Change space status
  static async changeSpaceStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const userId = req.user?.id || null;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const allowedStatuses = ["pending", "approved", "rejected", "active"];

      if (!allowedStatuses.includes(String(status).toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const space = await SpaceService.changeStatus(
        id,
        String(status).toLowerCase(),
        reason,
        userId
      );

      res.json({
        success: true,
        message: `Space status changed to ${status}`,
        data: space,
      });
    } catch (error) {
      console.error("Error in changeSpaceStatus:", error);
      res.status(400).json({
        success: false,
        message: "Failed to change space status",
        error: error.message,
      });
    }
  }

  // POST /api/spaces/:id/floor - Add floor to space
  static async addFloor(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.created_by || null;

      const floor = await SpaceService.addFloor(id, req.body, userId);

      res.status(201).json({
        success: true,
        message: "Floor added successfully",
        data: floor,
      });
    } catch (error) {
      console.error("Error in addFloor:", error);
      res.status(400).json({
        success: false,
        message: "Failed to add floor",
        error: error.message,
      });
    }
  }

  // GET /api/spaces/:id/floors - Get all floors in space
  static async getFloors(req, res) {
    try {
      const { id } = req.params;
      const floors = await SpaceService.getFloors(id);

      res.json({
        success: true,
        data: floors,
      });
    } catch (error) {
      console.error("Error in getFloors:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch floors",
        error: error.message,
      });
    }
  }

  // GET /api/spaces/statistics - Get space statistics
  static async getStatistics(req, res) {
    try {
      const statistics = await SpaceService.getStatistics();

      res.json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      console.error("Error in getStatistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
        error: error.message,
      });
    }
  }
}

module.exports = SpaceController;