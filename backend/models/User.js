const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    field: 'password_hash',
  },
  role: DataTypes.STRING,
  status: DataTypes.STRING,
  departmentId: {
    type: DataTypes.UUID,
    field: 'department_id',
  },
  phoneNumber: {
    type: DataTypes.STRING,
    field: 'phone_number',
  },
  timezone: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
}, {
  tableName: 'users',
  timestamps: false,
});

User.associate = (models) => {
  User.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
  User.hasMany(models.Allocation, { foreignKey: 'employeeId', as: 'allocations' });
  User.hasMany(models.TransferRequest, { foreignKey: 'requestedById', as: 'requestedTransfers' });
  User.hasMany(models.ResourceBooking, { foreignKey: 'bookedById', as: 'resourceBookings' });
  User.hasMany(models.MaintenanceRequest, { foreignKey: 'requestedById', as: 'maintenanceRequests' });
  User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
  User.hasMany(models.AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
};

module.exports = User;
