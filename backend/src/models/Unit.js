const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Unit = sequelize.define('Unit', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  floor_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'floors',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  unit_number: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  unit_type: {
    type: DataTypes.ENUM('retail', 'office', 'warehouse', 'mixed', 'other'),
    defaultValue: 'retail'
  },
  area_sqm: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  area_sqft: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  occupancy_status: {
    type: DataTypes.ENUM('available', 'occupied', 'maintenance', 'reserved', 'archived'),
    defaultValue: 'available'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  features: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  layout_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'units',
  timestamps: true,  // ✅ ADD THIS
  indexes: [
    {
      fields: ['floor_id']
    },
    {
      fields: ['occupancy_status']
    },
    {
      fields: ['unit_number'],
      unique: true
    }
  ]
});

module.exports = Unit;
