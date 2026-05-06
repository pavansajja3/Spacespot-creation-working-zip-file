const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middleware/auth');
const {
  validateCreateUnit,
  validateUpdateUnit
} = require('../validations/validation');

const UnitService = require('../services/unitService');

// GET /api/units/available
router.get('/available', authenticate, async (req, res) => {
  try {
    const units = await UnitService.getAvailableUnits();

    res.json({
      success: true,
      data: units
    });
  } catch (error) {
    console.error("Available units error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/units
router.get('/', authenticate, async (req, res) => {
  try {
    const units = await UnitService.getAllUnits(req.query);

    res.json({
      success: true,
      data: units
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/units/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const unit = await UnitService.getUnitById(req.params.id);

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/units
router.post('/', authenticate, validateCreateUnit, async (req, res) => {
  try {
    const unit = await UnitService.createUnit(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Unit created successfully',
      data: unit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/units/:id
router.put('/:id', authenticate, validateUpdateUnit, async (req, res) => {
  try {
    const unit = await UnitService.updateUnit(
      req.params.id,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Unit updated successfully',
      data: unit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/units/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await UnitService.deleteUnit(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Unit deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/units/floors/:floorId/available
router.get('/floors/:floorId/available', authenticate, async (req, res) => {
  try {
    const units = await UnitService.getAvailableUnits(req.params.floorId);

    res.json({
      success: true,
      data: units
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/units/:id/reserve
router.put('/:id/reserve', authenticate, async (req, res) => {
  try {
    const unit = await UnitService.reserveUnit(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Unit reserved successfully',
      data: unit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/units/:id/release
router.put('/:id/release', authenticate, async (req, res) => {
  try {
    const unit = await UnitService.releaseUnit(req.params.id);

    res.json({
      success: true,
      data: unit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;