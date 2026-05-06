const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  customer_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  lease_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'leases',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  unit_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'units',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  booking_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'bookings',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  payment_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'payments',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  notification_type: {
    type: DataTypes.ENUM('info', 'warning', 'error', 'success', 'payment_due', 'lease_expiring', 'booking_confirmation', 'booking_cancelled', 'document_ready', 'system'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  action_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'notifications',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['customer_id']
    },
    {
      fields: ['is_read']
    },
    {
      fields: ['sent_at']
    },
    {
      fields: ['user_id', 'is_read']
    }
  ]
});

module.exports = Notification;
