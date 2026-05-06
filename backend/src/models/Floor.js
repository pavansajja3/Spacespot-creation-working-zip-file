const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Floor = sequelize.define('Floor', {
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
  floor_number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  floor_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  floor_area_sqm: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  total_units: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  amenities: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  layout_image: {
    type: DataTypes.STRING(255),
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
    type: DataTypes.ENUM('active', 'maintenance', 'archived'),
    defaultValue: 'active'
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'floors',
  indexes: [
    {
      fields: ['space_id']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Floor;
