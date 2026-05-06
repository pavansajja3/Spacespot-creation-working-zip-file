const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  payment_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  lease_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'leases',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  booking_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'bookings',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  customer_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id'
    },
    onDelete: 'RESTRICT'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  amount_paid: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'bank_transfer', 'credit_card', 'debit_card', 'online', 'check', 'other'),
    allowNull: true
  },
  payment_type: {
    type: DataTypes.ENUM('rent', 'deposit', 'late_fee', 'service_charge', 'refund', 'other'),
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  reference_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'partial'),
    defaultValue: 'pending'
  },
  paid_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  refunded_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refund_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'payments',
  indexes: [
    {
      fields: ['payment_reference'],
      unique: true
    },
    {
      fields: ['lease_id']
    },
    {
      fields: ['booking_id']
    },
    {
      fields: ['customer_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['due_date']
    }
  ]
});

module.exports = Payment;
