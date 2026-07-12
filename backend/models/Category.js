const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  code: {
    type: DataTypes.STRING,
    unique: true,
  },
  customFields: {
    type: DataTypes.JSON,
    field: 'custom_fields',
  },
  status: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
}, {
  tableName: 'categories',
  timestamps: false,
});

Category.associate = (models) => {
  Category.hasMany(models.Asset, { foreignKey: 'categoryId', as: 'assets' });
};

module.exports = Category;
