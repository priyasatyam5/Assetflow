const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  assetId: {
    type: DataTypes.UUID,
    field: 'asset_id',
  },
  requestedById: {
    type: DataTypes.UUID,
    field: 'requested_by_id',
  },
  description: DataTypes.TEXT,
  priority: DataTypes.STRING,
  status: DataTypes.STRING,
  reviewedById: {
    type: DataTypes.UUID,
    field: 'reviewed_by_id',
  },
  technicianId: {
    type: DataTypes.UUID,
    field: 'technician_id',
  },
  vendorId: {
    type: DataTypes.UUID,
    field: 'vendor_id',
  },
  cost: DataTypes.DECIMAL(10, 2),
  resolutionNotes: {
    type: DataTypes.TEXT,
    field: 'resolution_notes',
  },
  photoUrl: {
    type: DataTypes.STRING,
    field: 'photo_url',
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
  tableName: 'maintenance_requests',
  timestamps: false,
});

MaintenanceRequest.associate = (models) => {
  MaintenanceRequest.belongsTo(models.Asset, { foreignKey: 'assetId', as: 'asset' });
  MaintenanceRequest.belongsTo(models.User, { foreignKey: 'requestedById', as: 'requestedBy' });
  MaintenanceRequest.belongsTo(models.User, { foreignKey: 'reviewedById', as: 'reviewedBy' });
  MaintenanceRequest.belongsTo(models.User, { foreignKey: 'technicianId', as: 'technician' });
  MaintenanceRequest.belongsTo(models.Vendor, { foreignKey: 'vendorId', as: 'vendor' });
};

module.exports = MaintenanceRequest;
