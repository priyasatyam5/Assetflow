const { sequelize } = require('../db');
const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const db = {};

const modelFiles = fs.readdirSync(__dirname).filter((file) => {
  return file.endsWith('.js') && file !== basename;
});

for (const file of modelFiles) {
  const model = require(path.join(__dirname, file));
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = require('sequelize');

module.exports = db;
