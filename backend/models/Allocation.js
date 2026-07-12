const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Allocation = sequelize.define('Allocation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  assetId: {
    type: DataTypes.UUID,
    field: 'asset_id',
  },
  allocatedToType: {
    type: DataTypes.STRING,
    field: 'allocated_to_type',
  },
  employeeId: {
    type: DataTypes.UUID,
    field: 'employee_id',
  },
  departmentId: {
    type: DataTypes.UUID,
    field: 'department_id',
  },
  allocatedById: {
    type: DataTypes.UUID,
    field: 'allocated_by_id',
  },
  expectedReturnDate: {
    type: DataTypes.DATEONLY,
    field: 'expected_return_date',
  },
  actualReturnDate: {
    type: DataTypes.DATEONLY,
    field: 'actual_return_date',
  },
  returnCondition: {
    type: DataTypes.STRING,
    field: 'return_condition',
  },
  returnNotes: {
    type: DataTypes.TEXT,
    field: 'return_notes',
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
  tableName: 'allocations',
  timestamps: false,
});

Allocation.associate = (models) => {
  Allocation.belongsTo(models.Asset, { foreignKey: 'assetId', as: 'asset' });
  Allocation.belongsTo(models.User, { foreignKey: 'employeeId', as: 'employee' });
  Allocation.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
  Allocation.belongsTo(models.User, { foreignKey: 'allocatedById', as: 'allocatedBy' });
  Allocation.hasMany(models.TransferRequest, { foreignKey: 'currentAllocationId', as: 'transferRequests' });
};

module.exports = Allocation;
