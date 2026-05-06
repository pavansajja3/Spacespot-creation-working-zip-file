const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lease = sequelize.define('Lease', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  lease_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
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
  lease_type: {
    type: DataTypes.ENUM('full_lease', 'partial_lease', 'sublease', 'co_working'),
    defaultValue: 'full_lease'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  monthly_rent: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  security_deposit: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  renewal_options: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  terms: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  special_conditions: {
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
    type: DataTypes.ENUM('draft', 'pending', 'active', 'completed', 'terminated', 'cancelled'),
    defaultValue: 'draft'
  },
  signed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  signed_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  createdAt: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW
},
updatedAt: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW
},
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'leases',
  timestamps: true,
  indexes: [
    {
      fields: ['lease_reference'],
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
      fields: ['start_date', 'end_date']
    }
  ]
});

module.exports = Lease;
