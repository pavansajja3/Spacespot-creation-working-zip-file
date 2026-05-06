const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { 
  validateCreatePayment, 
  validateUpdatePayment 
} = require('../validations/validation');
const PaymentService = require('../services/paymentService');

// GET /api/payments - Get all payments with filters
// Query params: page, limit, search, status, customer_id, lease_id, booking_id, payment_type, date_from, date_to, sortBy, order
// Authorization: Bearer token (user/admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const payments = await PaymentService.getAllPayments(req.query);
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/payments/:id - Get payment by ID with customer, lease, and booking info
// Authorization: Bearer token (user/admin)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const payment = await PaymentService.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/payments - Create new payment
// Authorization: Bearer token (user/admin)
router.post('/', authenticate, validateCreatePayment, async (req, res) => {
  try {
    const payment = await PaymentService.createPayment(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/payments/:id - Update payment (process payment, refund, etc.)
// Authorization: Bearer token (user/admin)
router.put('/:id', authenticate, validateUpdatePayment, async (req, res) => {
  try {
    const payment = await PaymentService.updatePayment(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });
  } catch (error) {
    if (error.message === 'Payment not found') {
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

// DELETE /api/payments/:id - Soft delete payment
// Authorization: Bearer token (admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await PaymentService.deletePayment(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Payment not found') {
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

// PUT /api/payments/:id/partial - Process partial payment
// Authorization: Bearer token (user/admin)
router.put('/:id/partial', authenticate, async (req, res) => {
  try {
    const payment = await PaymentService.processPartialPayment(
      req.params.id,
      req.body.amount,
      req.user.id
    );
    res.json({
      success: true,
      message: 'Partial payment processed successfully',
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/payments/statistics - Get payment statistics
// Authorization: Bearer token (user/admin)
router.get('/statistics', authenticate, async (req, res) => {
  try {
    const statistics = await PaymentService.getPaymentStatistics();
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
