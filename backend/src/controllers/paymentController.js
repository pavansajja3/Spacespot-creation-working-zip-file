const PaymentService = require('../services/paymentService');
const { validateCreatePayment } = require('../validations/validation');

class PaymentController {
  // GET /api/payments - Get all payments with filters
  static async getAllPayments(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        customerId,
        unitId,
        leaseId,
        paymentMethod,
        startDate,
        endDate,
        sortBy = 'due_date',
        order = 'DESC'
      } = req.query;

      const payments = await PaymentService.getAllPayments({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status,
        customerId,
        unitId,
        leaseId,
        paymentMethod,
        startDate,
        endDate,
        sortBy,
        order
      });

      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error in getAllPayments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payments',
        error: error.message
      });
    }
  }

  // GET /api/payments/:id - Get payment by ID
  static async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getPaymentById(id);

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
      console.error('Error in getPaymentById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment',
        error: error.message
      });
    }
  }

  // POST /api/payments - Create new payment
  static async createPayment(req, res) {
    try {
      const { body } = req;
      const userId = req.user.id;

      const payment = await PaymentService.createPayment(body, userId);

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error in createPayment:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to create payment',
        error: error.message
      });
    }
  }

  // PUT /api/payments/:id - Update payment
  static async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;
      const userId = req.user.id;

      const payment = await PaymentService.updatePayment(id, body, userId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        message: 'Payment updated successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error in updatePayment:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update payment',
        error: error.message
      });
    }
  }

  // DELETE /api/payments/:id - Soft delete payment
  static async deletePayment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await PaymentService.deletePayment(id, userId);

      res.json({
        success: true,
        message: 'Payment deleted successfully'
      });
    } catch (error) {
      console.error('Error in deletePayment:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to delete payment',
        error: error.message
      });
    }
  }

  // PUT /api/payments/:id/process - Process payment (integration with payment gateway)
  static async processPayment(req, res) {
    try {
      const { id } = req.params;
      const { paymentMethod, paymentDetails } = req.body;
      const userId = req.user.id;

      const payment = await PaymentService.processPayment(id, paymentMethod, paymentDetails, userId);

      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error in processPayment:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to process payment',
        error: error.message
      });
    }
  }

  // PUT /api/payments/:id/confirm - Confirm payment received
  static async confirmPayment(req, res) {
    try {
      const { id } = req.params;
      const { transactionId, notes } = req.body;
      const userId = req.user.id;

      const payment = await PaymentService.confirmPayment(id, {
        transactionId,
        notes
      }, userId);

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error in confirmPayment:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to confirm payment',
        error: error.message
      });
    }
  }

  // PUT /api/payments/:id/refund - Refund payment
  static async refundPayment(req, res) {
    try {
      const { id } = req.params;
      const { reason, refundAmount, refundMethod } = req.body;
      const userId = req.user.id;

      const payment = await PaymentService.refundPayment(id, {
        reason,
        refundAmount,
        refundMethod
      }, userId);

      res.json({
        success: true,
        message: 'Payment refunded successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error in refundPayment:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to refund payment',
        error: error.message
      });
    }
  }

  // PUT /api/payments/:id/fail - Mark payment as failed
  static async failPayment(req, res) {
    try {
      const { id } = req.params;
      const { failureReason, notes } = req.body;
      const userId = req.user.id;

      const payment = await PaymentService.failPayment(id, {
        failureReason,
        notes
      }, userId);

      res.json({
        success: true,
        message: 'Payment marked as failed',
        data: payment
      });
    } catch (error) {
      console.error('Error in failPayment:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to mark payment as failed',
        error: error.message
      });
    }
  }

  // POST /api/payments/:id/send-invoice - Send payment invoice
  static async sendInvoice(req, res) {
    try {
      const { id } = req.params;
      const { email, templateId } = req.body;
      const userId = req.user.id;

      await PaymentService.sendInvoice(id, email, templateId, userId);

      res.json({
        success: true,
        message: 'Invoice sent successfully'
      });
    } catch (error) {
      console.error('Error in sendInvoice:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to send invoice',
        error: error.message
      });
    }
  }

  // GET /api/payments/:id/payment-receipt - Get payment receipt
  static async getPaymentReceipt(req, res) {
    try {
      const { id } = req.params;

      const receipt = await PaymentService.getReceipt(id);

      res.json({
        success: true,
        data: receipt
      });
    } catch (error) {
      console.error('Error in getPaymentReceipt:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to fetch receipt',
        error: error.message
      });
    }
  }

  // GET /api/payments/statistics - Get payment statistics
  static async getStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const stats = await PaymentService.getStatistics(startDate, endDate);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getStatistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }

  // GET /api/payments/outstanding - Get outstanding payments
  static async getOutstandingPayments(req, res) {
    try {
      const { customerId, unitId, overdueOnly = false } = req.query;

      const payments = await PaymentService.getOutstandingPayments(customerId, unitId, overdueOnly === 'true');

      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error in getOutstandingPayments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch outstanding payments',
        error: error.message
      });
    }
  }
}

module.exports = PaymentController;
