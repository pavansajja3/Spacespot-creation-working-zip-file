const { Op } = require('sequelize');
const Lease = require('../models/Lease');
const Customer = require('../models/Customer');
const Unit = require('../models/Unit');
const Payment = require('../models/Payment');

class LeaseService {
  static async createLease(data, createdBy) {
    const leaseReference = `LEASE-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const lease = await Lease.create({
      ...data,
      lease_reference: leaseReference,
      created_by: createdBy
    });

    // Update unit occupancy status
    if (lease.status === 'active') {
      await Unit.update(
        { occupancy_status: 'occupied' },
        { where: { id: data.unit_id } }
      );
    }

    return lease;
  }

  static async getLeaseById(id) {
    return Lease.findByPk(id, {
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
      }, {
        model: Payment,
        as: 'payments',
        attributes: ['id', 'amount', 'status', 'due_date', 'paid_at']
      }],
      paranoid: false
    });
  }

  static async getAllLeases(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      customer_id,
      unit_id,
      sortBy = 'id',
      order = 'DESC'
    } = query;

    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { lease_reference: { [Op.iLike]: `%${search}%` } },
        { customer_id: { [Op.iLike]: `%${search}%` } }
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

    const { count, rows } = await Lease.findAndCountAll({
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
      order: [['id', 'DESC']],
      paranoid: false
    });

    return {
      leases: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  static async updateLease(id, data, updatedBy) {
    const lease = await Lease.findByPk(id);
    if (!lease) {
      throw new Error('Lease not found');
    }

    // Handle occupancy status change
    if (data.status && data.status !== lease.status) {
      if (data.status === 'active') {
        await Unit.update(
          { occupancy_status: 'occupied' },
          { where: { id: lease.unit_id } }
        );
      } else if (['completed', 'terminated', 'cancelled'].includes(data.status)) {
        await Unit.update(
          { occupancy_status: 'available' },
          { where: { id: lease.unit_id } }
        );
      }
    }

    await lease.update({
      ...data,
      updated_by: updatedBy
    });

    return lease;
  }

  static async deleteLease(id, deletedBy) {
    const lease = await Lease.findByPk(id);
    if (!lease) {
      throw new Error('Lease not found');
    }

    await lease.update({
      deleted_at: new Date(),
      deleted_by: deletedBy
    });

    return { message: 'Lease deleted successfully' };
  }

  static async getLeaseStatistics() {
    const totalLeases = await Lease.count({
      where: { deleted_at: null }
    });

    const activeLeases = await Lease.count({
      where: { status: 'active', deleted_at: null }
    });

    const leasesByStatus = await Lease.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { deleted_at: null },
      group: ['status']
    });

    const totalRevenue = await Lease.sum('monthly_rent', {
      where: { status: 'active', deleted_at: null }
    });

    return {
      total: totalLeases,
      active: activeLeases,
      by_status: leasesByStatus,
      total_monthly_revenue: totalRevenue || 0
    };
  }

  static async extendLease(leaseId, endDate, extendedBy) {
    const lease = await Lease.findByPk(leaseId);
    if (!lease) {
      throw new Error('Lease not found');
    }

    const updatedEndDate = new Date(endDate);
    const currentDate = new Date();
    
    if (updatedEndDate <= currentDate) {
      throw new Error('End date must be in the future');
    }

    await lease.update({
      end_date: updatedEndDate,
      updated_by: extendedBy
    });

    return lease;
  }
}

module.exports = LeaseService;
