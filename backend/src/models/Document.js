const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  document_reference: {
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
  customer_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  document_type: {
    type: DataTypes.ENUM('lease_agreement', 'addendum', 'invoice', 'receipt', 'contract', 'policy', 'other'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  file_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  file_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  is_template: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  generated_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  reviewed_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  approved_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  review_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  approval_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending_review', 'approved', 'rejected', 'active', 'archived'),
    defaultValue: 'draft'
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'documents',
  timestamps: true,
  indexes: [
    {
      fields: ['document_reference'],
      unique: true
    },
    {
      fields: ['lease_id']
    },
    {
      fields: ['customer_id']
    },
    {
      fields: ['document_type']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Document;
