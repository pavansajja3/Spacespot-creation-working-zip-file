const LeaseService = require('../services/leaseService');
const { validateCreateLease, validateUpdateLease } = require('../validations/validation');

class LeaseController {
  // GET /api/leases - Get all leases with filters
  static async getAllLeases(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        customerId,
        spaceId,
        unitId,
        sortBy = 'id',
        order = 'DESC'
      } = req.query;

      const leases = await LeaseService.getAllLeases({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status,
        customerId,
        spaceId,
        unitId,
        sortBy,
        order
      });

      res.json({
        success: true,
        data: leases
      });
    } catch (error) {
      console.error('Error in getAllLeases:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch leases',
        error: error.message
      });
    }
  }

  // GET /api/leases/:id - Get lease by ID
  static async getLeaseById(req, res) {
    try {
      const { id } = req.params;
      const lease = await LeaseService.getLeaseById(id);

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
      console.error('Error in getLeaseById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch lease',
        error: error.message
      });
    }
  }

  // POST /api/leases - Create new lease
  static async createLease(req, res) {
    try {
      const { body } = req;
      const userId = req.user.id;

      const lease = await LeaseService.createLease(body, userId);

      res.status(201).json({
        success: true,
        message: 'Lease created successfully',
        data: lease
      });
    } catch (error) {
      console.error('Error in createLease:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to create lease',
        error: error.message
      });
    }
  }

  // PUT /api/leases/:id - Update lease
  static async updateLease(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;
      const userId = req.user.id;

      const lease = await LeaseService.updateLease(id, body, userId);

      if (!lease) {
        return res.status(404).json({
          success: false,
          message: 'Lease not found'
        });
      }

      res.json({
        success: true,
        message: 'Lease updated successfully',
        data: lease
      });
    } catch (error) {
      console.error('Error in updateLease:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update lease',
        error: error.message
      });
    }
  }

  // DELETE /api/leases/:id - Soft delete lease
  static async deleteLease(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await LeaseService.deleteLease(id, userId);

      res.json({
        success: true,
        message: 'Lease deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteLease:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to delete lease',
        error: error.message
      });
    }
  }

  // PUT /api/leases/:id/change-status - Change lease status
  static async changeLeaseStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason, effectiveDate } = req.body;
      const userId = req.user.id;

      const lease = await LeaseService.changeStatus(id, status, reason, effectiveDate, userId);

      res.json({
        success: true,
        message: `Lease status changed to ${status}`,
        data: lease
      });
    } catch (error) {
      console.error('Error in changeLeaseStatus:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to change lease status',
        error: error.message
      });
    }
  }

  // POST /api/leases/:id/renew - Renew lease
  static async renewLease(req, res) {
    try {
      const { id } = req.params;
      const { renewalStartDate, renewalEndDate, renewalTerms, renewalPricing } = req.body;
      const userId = req.user.id;

      const lease = await LeaseService.renewLease(id, {
        renewalStartDate,
        renewalEndDate,
        renewalTerms,
        renewalPricing
      }, userId);

      res.status(201).json({
        success: true,
        message: 'Lease renewed successfully',
        data: lease
      });
    } catch (error) {
      console.error('Error in renewLease:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to renew lease',
        error: error.message
      });
    }
  }

  // POST /api/leases/:id/terminate - Terminate lease early
  static async terminateLease(req, res) {
    try {
      const { id } = req.params;
      const { terminationDate, reason, penaltyAmount } = req.body;
      const userId = req.user.id;

      const lease = await LeaseService.terminateLease(id, {
        terminationDate,
        reason,
        penaltyAmount
      }, userId);

      res.json({
        success: true,
        message: 'Lease terminated successfully',
        data: lease
      });
    } catch (error) {
      console.error('Error in terminateLease:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to terminate lease',
        error: error.message
      });
    }
  }

  // POST /api/leases/:id/document - Add document to lease
  static async addDocument(req, res) {
    try {
      const { id } = req.params;
      const { documentId } = req.body;
      const userId = req.user.id;

      const lease = await LeaseService.addDocument(id, documentId, userId);

      res.json({
        success: true,
        message: 'Document added successfully',
        data: lease
      });
    } catch (error) {
      console.error('Error in addDocument:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to add document',
        error: error.message
      });
    }
  }

  // GET /api/leases/:id/financial-summary - Get lease financial summary
  static async getFinancialSummary(req, res) {
    try {
      const { id } = req.params;
      const summary = await LeaseService.getFinancialSummary(id);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Error in getFinancialSummary:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch financial summary',
        error: error.message
      });
    }
  }
}

module.exports = LeaseController;
