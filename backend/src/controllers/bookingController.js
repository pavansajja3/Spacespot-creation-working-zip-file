const BookingService = require('../services/bookingService');
const { validateCreateBooking, validateUpdateBooking } = require('../validations/validation');

class BookingController {
  // GET /api/bookings - Get all bookings with filters
  static async getAllBookings(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        customerId,
        unitId,
        startDate,
        endDate,
        sortBy = 'booking_date',
        order = 'DESC'
      } = req.query;

      const bookings = await BookingService.getAllBookings({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status,
        customerId,
        unitId,
        startDate,
        endDate,
        sortBy,
        order
      });

      res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      console.error('Error in getAllBookings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: error.message
      });
    }
  }

  // GET /api/bookings/:id - Get booking by ID
  static async getBookingById(req, res) {
    try {
      const { id } = req.params;
      const booking = await BookingService.getBookingById(id);

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
      console.error('Error in getBookingById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking',
        error: error.message
      });
    }
  }

  // POST /api/bookings - Create new booking
  static async createBooking(req, res) {
    try {
      const { body } = req;
      const userId = req.user.id;

      const booking = await BookingService.createBooking(body, userId);

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error in createBooking:', error);
      
      if (error.message.includes('cannot be booked')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(400).json({
        success: false,
        message: 'Failed to create booking',
        error: error.message
      });
    }
  }

  // PUT /api/bookings/:id - Update booking
  static async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;
      const userId = req.user.id;

      const booking = await BookingService.updateBooking(id, body, userId);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        message: 'Booking updated successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error in updateBooking:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update booking',
        error: error.message
      });
    }
  }

  // DELETE /api/bookings/:id - Soft delete booking
  static async deleteBooking(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await BookingService.deleteBooking(id, userId);

      res.json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteBooking:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to delete booking',
        error: error.message
      });
    }
  }

  // PUT /api/bookings/:id/confirm - Confirm booking
  static async confirmBooking(req, res) {
    try {
      const { id } = req.params;
      const { paymentReference, notes } = req.body;
      const userId = req.user.id;

      const booking = await BookingService.confirmBooking(id, {
        paymentReference,
        notes
      }, userId);

      res.json({
        success: true,
        message: 'Booking confirmed successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error in confirmBooking:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to confirm booking',
        error: error.message
      });
    }
  }

  // PUT /api/bookings/:id/cancel - Cancel booking
  static async cancelBooking(req, res) {
    try {
      const { id } = req.params;
      const { reason, refundAmount } = req.body;
      const userId = req.user.id;

      const booking = await BookingService.cancelBooking(id, {
        reason,
        refundAmount
      }, userId);

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error in cancelBooking:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to cancel booking',
        error: error.message
      });
    }
  }

  // PUT /api/bookings/:id/checkin - Check-in booking
  static async checkInBooking(req, res) {
    try {
      const { id } = req.params;
      const { checkInTime, notes } = req.body;
      const userId = req.user.id;

      const booking = await BookingService.checkIn(id, {
        checkInTime,
        notes
      }, userId);

      res.json({
        success: true,
        message: 'Booking checked in successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error in checkInBooking:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to check in booking',
        error: error.message
      });
    }
  }

  // PUT /api/bookings/:id/checkout - Check-out booking
  static async checkOutBooking(req, res) {
    try {
      const { id } = req.params;
      const { checkOutTime, damageNotes, returnCondition } = req.body;
      const userId = req.user.id;

      const booking = await BookingService.checkOut(id, {
        checkOutTime,
        damageNotes,
        returnCondition
      }, userId);

      res.json({
        success: true,
        message: 'Booking checked out successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error in checkOutBooking:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to check out booking',
        error: error.message
      });
    }
  }

  // GET /api/bookings/available-units - Get available units for booking
  static async getAvailableUnits(req, res) {
    try {
      const { unitId, startDate, endDate } = req.query;

      const availableUnits = await BookingService.getAvailableUnits(unitId, startDate, endDate);

      res.json({
        success: true,
        data: availableUnits
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

  // GET /api/bookings/upcoming - Get upcoming bookings
  static async getUpcomingBookings(req, res) {
    try {
      const { unitId, limit = 10 } = req.query;

      const bookings = await BookingService.getUpcomingBookings(unitId, parseInt(limit));

      res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      console.error('Error in getUpcomingBookings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming bookings',
        error: error.message
      });
    }
  }

  // GET /api/bookings/stats/summary - Get booking statistics
  static async getBookingStats(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const stats = await BookingService.getBookingStats(startDate, endDate);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getBookingStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking statistics',
        error: error.message
      });
    }
  }
}

module.exports = BookingController;
