const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Unit = require('../models/Unit');
const Payment = require('../models/Payment');
const Pricing = require('../models/Pricing');
const Notification = require('../models/Notification');

class BookingService {
  static async createBooking(data, createdBy) {
    const bookingReference = `BKG-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // Check unit availability
    const hasActiveBooking = await Booking.count({
      where: {
        unit_id: data.unit_id,
        status: { [Op.in]: ['pending', 'confirmed'] },
        [Op.or]: [
          {
            [Op.and]: [
              { check_in_date: { [Op.lte]: data.check_out_date } },
              { check_out_date: { [Op.gte]: data.check_in_date } }
            ]
          }
        ]
      }
    });

    if (hasActiveBooking > 0) {
      throw new Error('Unit is not available for the selected dates');
    }

    const booking = await Booking.create({
      ...data,
      booking_reference: bookingReference,
      created_by: createdBy
    });

    // Send notification to customer
    await Notification.create({
      user_id: createdBy,
      customer_id: data.customer_id,
      booking_id: booking.id,
      notification_type: 'booking_confirmation',
      title: 'Booking Confirmed',
      message: `Your booking ${bookingReference} has been confirmed for unit ${data.unit_id}`
    });

    return booking;
  }

  static async getBookingById(id) {
    return Booking.findByPk(id, {
      include: [{
        model: Customer,
        as: 'customer',
        attributes: ['id', 'contact_person', 'email', 'phone']
      }, {
        model: Unit,
        as: 'unit',
        include: [{
          model: require('../models/Floor'),
          as: 'floor',
          include: [{
            model: require('../models/Space'),
            as: 'space'
          }]
        }]
      }],
      paranoid: false
    });
  }

  static async getAllBookings(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      customer_id,
      unit_id,
      date_from,
      date_to,
      sortBy = 'created_at',
      order = 'DESC'
    } = query;

    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { booking_reference: { [Op.iLike]: `%${search}%` } },
        { guest_name: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) {
      where.status = status;
    }
    if (customer_id) {
      where.customer_id = customer_id;
    }
    if (unit_id) {
      where.unit_id = unit_id;
    }
    if (date_from) {
      where.check_in_date = { [Op.gte]: new Date(date_from) };
    }
    if (date_to) {
      where.check_out_date = { [Op.lte]: new Date(date_to) };
    }

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [{
        model: Customer,
        as: 'customer',
        attributes: ['id', 'contact_person', 'email', 'phone']
      }, {
        model: Unit,
        as: 'unit',
        attributes: ['id', 'unit_number']
      }],
      limit,
      offset,
      order: [[sortBy, order]],
      paranoid: false
    });

    return {
      bookings: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  static async updateBooking(id, data, updatedBy) {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check if unit is available for new dates if changing dates
    if (data.check_in_date || data.check_out_date) {
      const existingBooking = await Booking.findOne({
        where: {
          id: { [Op.ne]: id },
          unit_id: booking.unit_id,
          status: { [Op.in]: ['pending', 'confirmed'] }
        }
      });

      if (existingBooking) {
        throw new Error('Unit is not available for the selected dates');
      }
    }

    if (data.status === 'confirmed') {
      booking.confirmed_at = new Date();
      booking.confirmed_by = updatedBy;
    } else if (data.status === 'checked_in') {
      booking.checked_in_at = new Date();
    } else if (data.status === 'checked_out') {
      booking.checked_out_at = new Date();
    }

    await booking.update({
      ...data,
      updated_by: updatedBy
    });

    // Send notification if status changed
    if (data.status && data.status !== booking.status) {
      await Notification.create({
        user_id: updatedBy,
        customer_id: booking.customer_id,
        booking_id: booking.id,
        notification_type: `booking_${data.status}`,
        title: `Booking Status Updated`,
        message: `Your booking status has been updated to ${data.status}`
      });
    }

    return booking;
  }

  static async cancelBooking(id, reason, deletedBy) {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'checked_in' || booking.status === 'checked_out') {
      throw new Error('Cannot cancel a checked-in or checked-out booking');
    }

    await booking.update({
      status: 'cancelled',
      deleted_at: new Date(),
      deleted_by: deletedBy
    });

    // Send notification to customer
    await Notification.create({
      user_id: deletedBy,
      customer_id: booking.customer_id,
      booking_id: booking.id,
      notification_type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Your booking has been cancelled. Reason: ${reason}`
    });

    return { message: 'Booking cancelled successfully' };
  }

  static async deleteBooking(id, deletedBy) {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    await booking.update({
      deleted_at: new Date(),
      deleted_by: deletedBy
    });

    return { message: 'Booking deleted successfully' };
  }

  static async getBookingStatistics() {
    const totalBookings = await Booking.count({
      where: { deleted_at: null }
    });

    const pendingBookings = await Booking.count({
      where: { status: 'pending', deleted_at: null }
    });

    const confirmedBookings = await Booking.count({
      where: { status: 'confirmed', deleted_at: null }
    });

    const bookingsByStatus = await Booking.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { deleted_at: null },
      group: ['status']
    });

    return {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      by_status: bookingsByStatus
    };
  }
}

module.exports = BookingService;
