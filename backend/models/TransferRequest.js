const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const TransferRequest = sequelize.define('TransferRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  assetId: {
    type: DataTypes.UUID,
    field: 'asset_id',
  },
  currentAllocationId: {
    type: DataTypes.UUID,
    field: 'current_allocation_id',
  },
  requestedById: {
    type: DataTypes.UUID,
    field: 'requested_by_id',
  },
  targetType: {
    type: DataTypes.STRING,
    field: 'target_type',
  },
  targetEmployeeId: {
    type: DataTypes.UUID,
    field: 'target_employee_id',
  },
  targetDepartmentId: {
    type: DataTypes.UUID,
    field: 'target_department_id',
  },
  status: DataTypes.STRING,
  reviewedById: {
    type: DataTypes.UUID,
    field: 'reviewed_by_id',
  },
  reviewNotes: {
    type: DataTypes.TEXT,
    field: 'review_notes',
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
  tableName: 'transfer_requests',
  timestamps: false,
});

TransferRequest.associate = (models) => {
  TransferRequest.belongsTo(models.Asset, { foreignKey: 'assetId', as: 'asset' });
  TransferRequest.belongsTo(models.Allocation, { foreignKey: 'currentAllocationId', as: 'currentAllocation' });
  TransferRequest.belongsTo(models.User, { foreignKey: 'requestedById', as: 'requestedBy' });
  TransferRequest.belongsTo(models.User, { foreignKey: 'targetEmployeeId', as: 'targetEmployee' });
  TransferRequest.belongsTo(models.Department, { foreignKey: 'targetDepartmentId', as: 'targetDepartment' });
  TransferRequest.belongsTo(models.User, { foreignKey: 'reviewedById', as: 'reviewedBy' });
};

module.exports = TransferRequest;
