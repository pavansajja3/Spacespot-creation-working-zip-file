const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
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
  unit_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'units',
      key: 'id'
    },
    onDelete: 'RESTRICT'
  },
  booking_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  check_in_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  check_out_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  guest_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  booking_type: {
    type: DataTypes.ENUM('short_term', 'long_term', 'event', 'other'),
    defaultValue: 'short_term'
  },
  special_requests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  guest_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  guest_email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  guest_phone: {
    type: DataTypes.STRING(20),
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
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'),
    defaultValue: 'pending'
  },
  confirmed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  checked_in_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  checked_out_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  confirmed_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'bookings',
  indexes: [
    {
      fields: ['booking_reference'],
      unique: true
    },
    {
      fields: ['customer_id']
    },
    {
      fields: ['unit_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['check_in_date', 'check_out_date']
    }
  ]
});

module.exports = Booking;
