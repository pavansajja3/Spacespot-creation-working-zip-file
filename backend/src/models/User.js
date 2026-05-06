const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Renamed the model to match the SQL table name 'users' for consistency,
// and updated field definitions to match the schema.

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true // Sequelize handles the sequence generation
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      // Added a check to ensure it matches the required format regex, if necessary,
      // though Sequelize validation is generally handled by framework hooks/services.
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  role: {
    // Matches SQL constraint: ('admin', 'manager', 'customer')
    type: DataTypes.ENUM('admin', 'manager', 'customer'),
    allowNull: false,
    defaultValue: 'customer' // Updated default role
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  phone: {
    type: DataTypes.STRING(50), // Increased length to match SQL flexibility
    allowNull: true
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  last_login_at: { // Updated field name to match SQL
    type: DataTypes.DATE,
    allowNull: true
  },
  reset_token: {
  type: DataTypes.TEXT,
  allowNull: true
},

reset_token_expiry: {
  type: DataTypes.DATE,
  allowNull: true
}
  // ,
  // failed_login_attempts: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   defaultValue: 0
  // },
  // locked_until: {
  //   type: DataTypes.DATE,
  //   allowNull: true
  // },
  // created_by: {
  //   type: DataTypes.BIGINT,
  //   allowNull: true
  // },
  // updated_by: {
  //   type: DataTypes.BIGINT,
  //   allowNull: true
  // },
  // deleted_by: {
  //   type: DataTypes.BIGINT,
  //   allowNull: true
  // }, 
 }, {
  tableName: 'users',
  timestamps: true, // Ensures standard createdAt/updatedAt handling, supplemented by explicit fields above
  createdAt: 'created_at',   // map JS createdAt → DB created_at
  updatedAt: 'updated_at',   // map JS updatedAt → DB updated_at
  paranoid: true, // Enables Sequelize soft deletes using deletedAt
  deletedAt: 'deleted_at',   // map JS updatedAt → DB updated_at
  indexes: [
    {
      fields: ['email'],
      unique: true
    },
    {
      fields: ['role']
    }
  ]
});

module.exports = User;
