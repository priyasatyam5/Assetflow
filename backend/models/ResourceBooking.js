const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const ResourceBooking = sequelize.define('ResourceBooking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  assetId: {
    type: DataTypes.UUID,
    field: 'asset_id',
  },
  bookedById: {
    type: DataTypes.UUID,
    field: 'booked_by_id',
  },
  startTime: {
    type: DataTypes.DATE,
    field: 'start_time',
  },
  endTime: {
    type: DataTypes.DATE,
    field: 'end_time',
  },
  status: DataTypes.STRING,
  approvedById: {
    type: DataTypes.UUID,
    field: 'approved_by_id',
  },
  approvalNotes: {
    type: DataTypes.TEXT,
    field: 'approval_notes',
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
  tableName: 'resource_bookings',
  timestamps: false,
});

ResourceBooking.associate = (models) => {
  ResourceBooking.belongsTo(models.Asset, { foreignKey: 'assetId', as: 'asset' });
  ResourceBooking.belongsTo(models.User, { foreignKey: 'bookedById', as: 'bookedBy' });
  ResourceBooking.belongsTo(models.User, { foreignKey: 'approvedById', as: 'approvedBy' });
};

module.exports = ResourceBooking;
