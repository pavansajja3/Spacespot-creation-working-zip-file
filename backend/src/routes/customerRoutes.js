const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { 
  validateCreateCustomer, 
  validateUpdateCustomer 
} = require('../validations/validation');
const CustomerService = require('../services/customerService');

// GET /api/customers - Get all customers with pagination and filters
// Query params: page, limit, search, status, sortBy, order
// Authorization: Bearer token (user/admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const customers = await CustomerService.getAllCustomers(req.query);
    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/customers/:id - Get customer by ID
// Authorization: Bearer token (user/admin)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const customer = await CustomerService.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/customers - Create new customer
// Authorization: Bearer token (user/admin)
router.post('/', authenticate, validateCreateCustomer, async (req, res) => {
  try {
    const customer = await CustomerService.createCustomer(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/customers/:id - Update customer
// Authorization: Bearer token (user/admin)
router.put('/:id', authenticate, validateUpdateCustomer, async (req, res) => {
  try {
    const customer = await CustomerService.updateCustomer(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    if (error.message === 'Customer not found') {
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

// DELETE /api/customers/:id - Soft delete customer
// Authorization: Bearer token (admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await CustomerService.deleteCustomer(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Customer not found') {
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

// GET /api/customers/statistics - Get customer statistics
// Authorization: Bearer token (user/admin)
router.get('/statistics', authenticate, async (req, res) => {
  try {
    const statistics = await CustomerService.getCustomerStatistics();
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
