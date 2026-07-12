const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  assetTag: {
    type: DataTypes.STRING,
    // unique: true,   // commented out - DB-level UNIQUE constraint in schema may still apply
    field: 'asset_tag',
  },
  serialNumber: {
    type: DataTypes.STRING,
    // unique: true,   // commented out - DB-level UNIQUE constraint in schema may still apply
    field: 'serial_number',
  },
  categoryId: {
    type: DataTypes.UUID,
    field: 'category_id',
  },
  vendorId: {
    type: DataTypes.UUID,
    field: 'vendor_id',
  },
  locationId: {
    type: DataTypes.UUID,
    field: 'location_id',
  },
  parentAssetId: {
    type: DataTypes.UUID,
    field: 'parent_asset_id',
  },
  acquisitionDate: {
    type: DataTypes.DATEONLY,
    field: 'acquisition_date',
  },
  acquisitionCost: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'acquisition_cost',
  },
  condition: DataTypes.STRING,
  isSharedBookable: {
    type: DataTypes.BOOLEAN,
    field: 'is_shared_bookable',
  },
  requiresBookingApproval: {
    type: DataTypes.BOOLEAN,
    field: 'requires_booking_approval',
  },
  status: DataTypes.STRING,
  documentUrls: {
    type: DataTypes.JSON,
    field: 'document_urls',
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
  tableName: 'assets',
  timestamps: false,
});

Asset.associate = (models) => {
  Asset.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
  Asset.belongsTo(models.Vendor, { foreignKey: 'vendorId', as: 'vendor' });
  Asset.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
  Asset.belongsTo(models.Asset, { foreignKey: 'parentAssetId', as: 'parent' });
  Asset.hasMany(models.Asset, { foreignKey: 'parentAssetId', as: 'children' });
  Asset.hasMany(models.Allocation, { foreignKey: 'assetId', as: 'allocations' });
  Asset.hasMany(models.TransferRequest, { foreignKey: 'assetId', as: 'transferRequests' });
  Asset.hasMany(models.ResourceBooking, { foreignKey: 'assetId', as: 'resourceBookings' });
  Asset.hasMany(models.MaintenanceRequest, { foreignKey: 'assetId', as: 'maintenanceRequests' });
  Asset.hasMany(models.AuditResult, { foreignKey: 'assetId', as: 'auditResults' });
  Asset.hasMany(models.AuditDiscrepancy, { foreignKey: 'assetId', as: 'auditDiscrepancies' });
};

module.exports = Asset;
