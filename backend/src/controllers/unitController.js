const UnitService = require('../services/unitService');
const { validateCreateUnit, validateUpdateUnit } = require('../validations/validation');

class UnitController {
  // GET /api/units - Get all units with filters
  static async getAllUnits(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        spaceId,
        floorId,
        sortBy = 'id',
        order = 'DESC'
      } = req.query;

      const units = await UnitService.getAllUnits({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status,
        spaceId,
        floorId,
        sortBy,
        order
      });

      res.json({
        success: true,
        data: units
      });
    } catch (error) {
      console.error('Error in getAllUnits:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch units',
        error: error.message
      });
    }
  }

  // GET /api/units/:id - Get unit by ID
  static async getUnitById(req, res) {
    try {
      const { id } = req.params;
      const unit = await UnitService.getUnitById(id);

      if (!unit) {
        return res.status(404).json({
          success: false,
          message: 'Unit not found'
        });
      }

      res.json({
        success: true,
        data: unit
      });
    } catch (error) {
      console.error('Error in getUnitById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unit',
        error: error.message
      });
    }
  }

  // POST /api/units - Create new unit
  static async createUnit(req, res) {
    try {
      const { body } = req;
      const userId = req.user.id;

      const unit = await UnitService.createUnit(body, userId);

      res.status(201).json({
        success: true,
        message: 'Unit created successfully',
        data: unit
      });
    } catch (error) {
      console.error('Error in createUnit:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Unit with this reference already exists'
        });
      }

      res.status(400).json({
        success: false,
        message: 'Failed to create unit',
        error: error.message
      });
    }
  }

  // PUT /api/units/:id - Update unit
  static async updateUnit(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;
      const userId = req.user.id;

      const unit = await UnitService.updateUnit(id, body, userId);

      if (!unit) {
        return res.status(404).json({
          success: false,
          message: 'Unit not found'
        });
      }

      res.json({
        success: true,
        message: 'Unit updated successfully',
        data: unit
      });
    } catch (error) {
      console.error('Error in updateUnit:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update unit',
        error: error.message
      });
    }
  }

  // DELETE /api/units/:id - Soft delete unit
  static async deleteUnit(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await UnitService.deleteUnit(id, userId);

      res.json({
        success: true,
        message: 'Unit deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteUnit:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to delete unit',
        error: error.message
      });
    }
  }

  // PUT /api/units/:id/occupancy-status - Update occupancy status
  static async updateOccupancyStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, leaseStartDate, leaseEndDate, customerId, notes } = req.body;
      const userId = req.user.id;

      const unit = await UnitService.updateOccupancyStatus(id, status, {
        leaseStartDate,
        leaseEndDate,
        customerId,
        notes,
        userId
      });

      res.json({
        success: true,
        message: `Unit occupancy status updated to ${status}`,
        data: unit
      });
    } catch (error) {
      console.error('Error in updateOccupancyStatus:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update occupancy status',
        error: error.message
      });
    }
  }

  // POST /api/units/:id/photos - Add unit photos
  static async addUnitPhotos(req, res) {
    try {
      const { id } = req.params;
      const { photos } = req.body;
      const userId = req.user.id;

      const unit = await UnitService.addPhotos(id, photos, userId);

      res.json({
        success: true,
        message: 'Photos added successfully',
        data: unit
      });
    } catch (error) {
      console.error('Error in addUnitPhotos:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to add photos',
        error: error.message
      });
    }
  }

  // DELETE /api/units/:id/photo/:photoId - Remove unit photo
  static async removeUnitPhoto(req, res) {
    try {
      const { id, photoId } = req.params;
      const userId = req.user.id;

      const unit = await UnitService.removePhoto(id, photoId, userId);

      res.json({
        success: true,
        message: 'Photo removed successfully',
        data: unit
      });
    } catch (error) {
      console.error('Error in removeUnitPhoto:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to remove photo',
        error: error.message
      });
    }
  }

  // GET /api/units/available - Get available units
  static async getAvailableUnits(req, res) {
    try {
      const { spaceId, floorId, areaFrom, areaTo, sortBy = 'id', order = 'ASC' } = req.query;

      const units = await UnitService.getAvailableUnits(req.query.floorId || null);

          res.json({
            success: true,
            data: units
          });
    } catch (error) {
      console.error('Error in getAvailableUnits:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch available units',
        error: error.message
      });
    }
  }
}

module.exports = UnitController;
