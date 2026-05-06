const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { 
  validateCreateLease, 
  validateUpdateLease 
} = require('../validations/validation');
const LeaseService = require('../services/leaseService');

// GET /api/leases - Get all leases with filters
// Query params: page, limit, search, status, customer_id, unit_id, sortBy, order
// Authorization: Bearer token (user/admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const leases = await LeaseService.getAllLeases(req.query);
    res.json({
      success: true,
      data: leases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/leases/:id - Get lease by ID with customer, unit, and payments
// Authorization: Bearer token (user/admin)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const lease = await LeaseService.getLeaseById(req.params.id);
    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }
    res.json({
      success: true,
      data: lease
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/leases - Create new lease
// Authorization: Bearer token (user/admin)
router.post('/', authenticate, validateCreateLease, async (req, res) => {
  try {
    const lease = await LeaseService.createLease(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Lease created successfully',
      data: lease
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/leases/:id - Update lease
// Authorization: Bearer token (user/admin)
router.put('/:id', authenticate, validateUpdateLease, async (req, res) => {
  try {
    const lease = await LeaseService.updateLease(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      message: 'Lease updated successfully',
      data: lease
    });
  } catch (error) {
    if (error.message === 'Lease not found') {
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

// DELETE /api/leases/:id - Soft delete lease
// Authorization: Bearer token (admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await LeaseService.deleteLease(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Lease deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Lease not found') {
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

// PUT /api/leases/:id/extend - Extend lease end date
// Authorization: Bearer token (user/admin)
router.put('/:id/extend', authenticate, async (req, res) => {
  try {
    const lease = await LeaseService.extendLease(
      req.params.id,
      req.body.end_date,
      req.user.id
    );
    res.json({
      success: true,
      message: 'Lease extended successfully',
      data: lease
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/leases/statistics - Get lease statistics
// Authorization: Bearer token (user/admin)
router.get('/statistics', authenticate, async (req, res) => {
  try {
    const statistics = await LeaseService.getLeaseStatistics();
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
