const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'spacespot',
  process.env.DB_USER || 'ss_app',
  process.env.DB_PASSWORD || 'Ok4Sp@ceSp0t',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

sequelize
  .authenticate()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
