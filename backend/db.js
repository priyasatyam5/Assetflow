const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.CLEARDB_DATABASE_URL || process.env.JAWSDB_URL;

const sequelize = new Sequelize(connectionString || {
  host: process.env.HOST || 'localhost',
  port: Number(process.env.PORT || 3306),
  username: process.env.USER || process.env.USERNAME || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DATABASE || 'assetflow',
  dialect: 'mysql',
  logging: false,
  dialectOptions: process.env.DB_SSL === 'true' ? {
    ssl: { rejectUnauthorized: false },
  } : {},
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const syncDatabase = async () => {
  const models = require('./models');
  await sequelize.authenticate();
  await sequelize.sync({ alter: false });
  console.log('Database synchronized successfully');
  return models;
};

module.exports = {
  sequelize,
  syncDatabase,
};
