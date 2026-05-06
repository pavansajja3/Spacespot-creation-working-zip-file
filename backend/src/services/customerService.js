const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const Customer = require('../models/Customer');

class CustomerService {
  static async createCustomer(data, createdBy) {
  const customerReference = `CUST-${Date.now()}-${uuidv4()
    .substring(0, 4)
    .toUpperCase()}`;

  const customer = await Customer.create({
    customer_reference: customerReference,
    company_name: data.company_name,
    contact_person: data.contact_person,
    email: data.email,
    phone: data.phone,
    address: data.address,
    website: data.website,
    tax_id: data.tax_id,
    status: data.status || 'active',
    created_by: createdBy,
    updated_by: createdBy
  });

  return customer;
}

  static async getCustomerById(id) {
    return Customer.findByPk(id, {
      include: [{
        model: require('../models/Lease'),
        as: 'leases',
        attributes: ['id', 'lease_reference', 'status', 'start_date', 'end_date']
      }],
      paranoid: false
    });
  }

  static async getAllCustomers(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'createdAt',
      order = 'DESC'
    } = query;

    const offset = (page - 1) * limit;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { customer_reference: { [Op.iLike]: `%${search}%` } },
        { contact_person: { [Op.iLike]: `%${search}%` } },
        { company_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Customer.findAndCountAll({where,limit,offset,order: [[sortBy === 'created_at' ? 'createdAt' : sortBy, order]],
      paranoid: false
    });

    return {
      customers: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  static async updateCustomer(id, data, updatedBy) {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    await customer.update({
      ...data,
      updated_by: updatedBy
    });

    return customer;
  }

  static async deleteCustomer(id, deletedBy) {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    await customer.update({
      deleted_at: new Date(),
      deleted_by: deletedBy
    });

    return { message: 'Customer deleted successfully' };
  }

  static async getCustomerStatistics() {
    const totalCustomers = await Customer.count({
      where: { deleted_at: null }
    });

    const activeCustomers = await Customer.count({
      where: { status: 'active', deleted_at: null }
    });

    const customersByStatus = await Customer.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { deleted_at: null },
      group: ['status']
    });

    return {
      total: totalCustomers,
      active: activeCustomers,
      by_status: customersByStatus
    };
  }
}

module.exports = CustomerService;
