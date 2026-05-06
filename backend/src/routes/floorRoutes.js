const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { 
  validateCreateFloor, 
  validateUpdateFloor 
} = require('../validations/validation');
const FloorService = require('../services/floorService');

// GET /api/spaces/:spaceId/floors - Get all floors for a space
// Path params: spaceId
// Query params: page, limit, status, sortBy, order
// Authorization: Bearer token (user/admin)
router.get('/spaces/:spaceId/floors', authenticate, async (req, res) => {
  try {
    const floors = await FloorService.getAllFloors(req.params.spaceId, req.query);
    res.json({
      success: true,
      data: floors
    });
  } catch (error) {
    if (error.message === 'Space not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/floors/:id - Get floor by ID with nested units
// Authorization: Bearer token (user/admin)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const floor = await FloorService.getFloorById(req.params.id);
    if (!floor) {
      return res.status(404).json({
        success: false,
        message: 'Floor not found'
      });
    }
    res.json({
      success: true,
      data: floor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/floors - Create new floor
// Authorization: Bearer token (user/admin)
router.post('/', authenticate, validateCreateFloor, async (req, res) => {
  try {
    const floor = await FloorService.createFloor(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Floor created successfully',
      data: floor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/floors/:id - Update floor
// Authorization: Bearer token (user/admin)
router.put('/:id', authenticate, validateUpdateFloor, async (req, res) => {
  try {
    const floor = await FloorService.updateFloor(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      message: 'Floor updated successfully',
      data: floor
    });
  } catch (error) {
    if (error.message === 'Floor not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/floors/:id - Delete floor
// Authorization: Bearer token (admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await FloorService.deleteFloor(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Floor deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Floor not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
