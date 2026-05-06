const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { 
  validateCreateBooking, 
  validateUpdateBooking 
} = require('../validations/validation');
const BookingService = require('../services/bookingService');

// GET /api/bookings - Get all bookings with filters
// Query params: page, limit, search, status, customer_id, unit_id, date_from, date_to, sortBy, order
// Authorization: Bearer token (user/admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const bookings = await BookingService.getAllBookings(req.query);
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/bookings/:id - Get booking by ID with customer and unit info
// Authorization: Bearer token (user/admin)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await BookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/bookings - Create new booking
// Authorization: Bearer token (user/admin)
router.post('/', authenticate, validateCreateBooking, async (req, res) => {
  try {
    const booking = await BookingService.createBooking(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/bookings/:id - Update booking
// Authorization: Bearer token (user/admin)
router.put('/:id', authenticate, validateUpdateBooking, async (req, res) => {
  try {
    const booking = await BookingService.updateBooking(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    if (error.message === 'Booking not found') {
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

// DELETE /api/bookings/:id - Soft delete booking
// Authorization: Bearer token (admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await BookingService.deleteBooking(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Booking not found') {
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

// PUT /api/bookings/:id/cancel - Cancel a booking
// Authorization: Bearer token (admin)
router.put('/:id/cancel', authenticate, authorize('admin'), async (req, res) => {
  try {
    await BookingService.cancelBooking(req.params.id, req.body.reason, req.user.id);
    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    if (error.message === 'Booking not found') {
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

// GET /api/bookings/statistics - Get booking statistics
// Authorization: Bearer token (user/admin)
router.get('/statistics', authenticate, async (req, res) => {
  try {
    const statistics = await BookingService.getBookingStatistics();
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
