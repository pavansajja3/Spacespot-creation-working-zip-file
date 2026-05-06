const { Op } = require('sequelize');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Lease = require('../models/Lease');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

class PaymentService {
  static async createPayment(data, createdBy) {
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const payment = await Payment.create({
      ...data,
      payment_reference: paymentReference,
      created_by: createdBy
    });

    // Send notification if payment is due
    if (payment.status === 'pending') {
      await Notification.create({
        user_id: createdBy,
        customer_id: data.customer_id,
        lease_id: data.lease_id,
        booking_id: data.booking_id,
        payment_id: payment.id,
        notification_type: 'payment_due',
        title: 'Payment Due',
        message: `A payment of $${payment.amount} is due on ${payment.due_date}`,
        action_url: `/payments/${payment.id}`
      });
    }

    return payment;
  }

  static async getPaymentById(id) {
    return Payment.findByPk(id, {
      include: [{
        model: Customer,
        as: 'customer',
        attributes: ['id', 'contact_person', 'email', 'phone']
      }, {
        model: Lease,
        as: 'lease',
        attributes: ['id', 'lease_reference'],
        required: false
      }, {
        model: Booking,
        as: 'booking',
        attributes: ['id', 'booking_reference'],
        required: false
      }],
      paranoid: false
    });
  }

  static async getAllPayments(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      customer_id,
      lease_id,
      booking_id,
      payment_type,
      date_from,
      date_to,
      sortBy = 'created_at',
      order = 'DESC'
    } = query;

    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { payment_reference: { [Op.iLike]: `%${search}%` } },
        { transaction_id: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) {
      where.status = status;
    }
    if (customer_id) {
      where.customer_id = customer_id;
    }
    if (lease_id) {
      where.lease_id = lease_id;
    }
    if (booking_id) {
      where.booking_id = booking_id;
    }
    if (payment_type) {
      where.payment_type = payment_type;
    }
    if (date_from) {
      where.due_date = { [Op.gte]: new Date(date_from) };
    }
    if (date_to) {
      where.due_date = { [Op.lte]: new Date(date_to) };
    }

    const { count, rows } = await Payment.findAndCountAll({
      where,
      include: [{
        model: Customer,
        as: 'customer',
        attributes: ['id', 'contact_person', 'email']
      }, {
        model: Lease,
        as: 'lease',
        attributes: ['id', 'lease_reference', 'start_date', 'end_date'],
        required: false
      }, {
        model: Booking,
        as: 'booking',
        attributes: ['id', 'booking_reference', 'check_in_date', 'check_out_date'],
        required: false
      }],
      limit,
      offset,
      order: [[sortBy, order]],
      paranoid: false
    });

    return {
      payments: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  static async updatePayment(id, data, updatedBy) {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Handle payment completion
    if (data.status === 'completed') {
      payment.paid_at = new Date();
      payment.amount_paid = data.amount_paid || payment.amount;
      payment.paid_by = updatedBy;
      payment.transaction_id = data.transaction_id || payment.transaction_id;
      payment.reference_number = data.reference_number || payment.reference_number;
    }

    // Handle payment failure
    if (data.status === 'failed') {
      payment.paid_by = updatedBy;
    }

    // Handle refund
    if (data.status === 'refunded') {
      payment.refunded_at = new Date();
      payment.refund_reason = data.refund_reason;
      payment.paid_by = updatedBy;
    }

    await payment.update({
      ...data,
      updated_by: updatedBy
    });

    // Send notification if status changed to completed
    if (data.status === 'completed') {
      await Notification.create({
        user_id: updatedBy,
        customer_id: payment.customer_id,
        lease_id: payment.lease_id,
        booking_id: payment.booking_id,
        payment_id: payment.id,
        notification_type: 'success',
        title: 'Payment Successful',
        message: `Your payment of $${payment.amount_paid} has been completed successfully`,
        action_url: `/payments/${payment.id}`
      });
    }

    return payment;
  }

  static async deletePayment(id, deletedBy) {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status === 'completed' || payment.status === 'refunded') {
      throw new Error('Cannot delete completed or refunded payments');
    }

    await payment.update({
      deleted_at: new Date(),
      deleted_by: deletedBy
    });

    return { message: 'Payment deleted successfully' };
  }

  static async processPartialPayment(paymentId, amount, processedBy) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status === 'completed') {
      throw new Error('Payment already completed');
    }

    const currentAmountPaid = payment.amount_paid || 0;
    const newAmountPaid = parseFloat(currentAmountPaid) + parseFloat(amount);

    if (newAmountPaid > payment.amount) {
      throw new Error('Payment amount exceeds total amount');
    }

    await payment.update({
      amount_paid: newAmountPaid
    });

    if (newAmountPaid >= payment.amount) {
      await payment.update({
        status: 'completed'
      });
    } else {
      await payment.update({
        status: 'partial'
      });
    }

    return payment;
  }

  static async getPaymentStatistics() {
    const totalPayments = await Payment.count({
      where: { deleted_at: null }
    });

    const pendingPayments = await Payment.count({
      where: { status: 'pending', deleted_at: null }
    });

    const completedPayments = await Payment.count({
      where: { status: 'completed', deleted_at: null }
    });

    const totalRevenue = await Payment.sum('amount_paid', {
      where: { status: 'completed', deleted_at: null }
    });

    const paymentsByStatus = await Payment.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { deleted_at: null },
      group: ['status']
    });

    const paymentsByType = await Payment.findAll({
      attributes: [
        'payment_type',
        [require('sequelize').fn('SUM', require('sequelize').col('amount_paid')), 'total'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { deleted_at: null },
      group: ['payment_type']
    });

    return {
      total: totalPayments,
      pending: pendingPayments,
      completed: completedPayments,
      total_revenue: totalRevenue || 0,
      by_status: paymentsByStatus,
      by_type: paymentsByType
    };
  }
}

module.exports = PaymentService;
