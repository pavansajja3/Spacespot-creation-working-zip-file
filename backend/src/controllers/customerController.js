const CustomerService = require('../services/customerService');
const { validateCreateCustomer, validateUpdateCustomer } = require('../validations/validation');

class CustomerController {
  // GET /api/customers - Get all customers with filters
  static async getAllCustomers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        city,
        industry,
        sortBy = 'createdAt',
        order = 'DESC'
      } = req.query;

      const customers = await CustomerService.getAllCustomers({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status,
        city,
        industry,
        sortBy,
        order
      });

      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Error in getAllCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customers',
        error: error.message
      });
    }
  }

  // GET /api/customers/:id - Get customer by ID
  static async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const customer = await CustomerService.getCustomerById(id);

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
      console.error('Error in getCustomerById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer',
        error: error.message
      });
    }
  }

  // POST /api/customers - Create new customer
  static async createCustomer(req, res) {
    try {
      const { body } = req;
      const userId = req.user.id;

      const customer = await CustomerService.createCustomer(body, userId);

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error in createCustomer:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Customer with this email already exists'
        });
      }

      res.status(400).json({
        success: false,
        message: 'Failed to create customer',
        error: error.message
      });
    }
  }

  // PUT /api/customers/:id - Update customer
  static async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const { body } = req;
      const userId = req.user.id;

      const customer = await CustomerService.updateCustomer(id, body, userId);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error in updateCustomer:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update customer',
        error: error.message
      });
    }
  }

  // DELETE /api/customers/:id - Soft delete customer
  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await CustomerService.deleteCustomer(id, userId);

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteCustomer:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to delete customer',
        error: error.message
      });
    }
  }

  // PUT /api/customers/:id/change-status - Change customer status
  static async changeCustomerStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const userId = req.user.id;

      const customer = await CustomerService.changeStatus(id, status, reason, userId);

      res.json({
        success: true,
        message: `Customer status changed to ${status}`,
        data: customer
      });
    } catch (error) {
      console.error('Error in changeCustomerStatus:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to change customer status',
        error: error.message
      });
    }
  }

  // GET /api/customers/:id/lease-history - Get customer lease history
  static async getLeaseHistory(req, res) {
    try {
      const { id } = req.params;
      const history = await CustomerService.getLeaseHistory(id);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error in getLeaseHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch lease history',
        error: error.message
      });
    }
  }

  // GET /api/customers/statistics - Get customer statistics
  static async getStatistics(req, res) {
    try {
      const statistics = await CustomerService.getStatistics();

      res.json({
        success: true,
        data: statistics
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
}

module.exports = CustomerController;
