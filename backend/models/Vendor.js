const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  contactName: {
    type: DataTypes.STRING,
    field: 'contact_name',
  },
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  supportDetails: {
    type: DataTypes.TEXT,
    field: 'support_details',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
}, {
  tableName: 'vendors',
  timestamps: false,
});

Vendor.associate = (models) => {
  Vendor.hasMany(models.Asset, { foreignKey: 'vendorId', as: 'assets' });
  Vendor.hasMany(models.MaintenanceRequest, { foreignKey: 'vendorId', as: 'maintenanceRequests' });
};

module.exports = Vendor;
