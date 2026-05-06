const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pricing = sequelize.define('Pricing', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  space_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'spaces',
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
  price_per_sqm: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  price_per_sqft: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  monthly_rent: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  annual_rent: {
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
  effective_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  discount_rules: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  updated_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'pricing',
  indexes: [
    {
      fields: ['space_id']
    },
    {
      fields: ['unit_id']
    },
    {
      fields: ['effective_date']
    },
    {
      fields: ['effective_date', 'expiry_date']
    }
  ]
});

module.exports = Pricing;
