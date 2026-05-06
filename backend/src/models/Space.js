const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Space = sequelize.define('Space', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  space_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'USA'
  },
  postal_code: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  total_area_sqm: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  floor_count: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  amenities: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  features: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },

  // ✅ FIXED STATUS
  status: {
    type: DataTypes.ENUM("draft","pending", "approved", "rejected", "active", "inactive"),
    defaultValue: "draft"
  },

  // ✅ NEW FIELDS
  images: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  documents: {
  type: DataTypes.JSONB,
  allowNull: true,
  defaultValue: []
},

  approval_note: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: 'spaces',
  indexes: [
    {
      fields: ['space_reference'],
      unique: true
    },
    {
      fields: ['status']
    },
    {
      fields: ['city', 'state']
    }
  ]
});

module.exports = Space;