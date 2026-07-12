const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const AuditCycle = sequelize.define('AuditCycle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  scopeType: {
    type: DataTypes.STRING,
    field: 'scope_type',
  },
  departmentId: {
    type: DataTypes.UUID,
    field: 'department_id',
  },
  locationId: {
    type: DataTypes.UUID,
    field: 'location_id',
  },
  startDate: {
    type: DataTypes.DATEONLY,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    field: 'end_date',
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
  tableName: 'audit_cycles',
  timestamps: false,
});

AuditCycle.associate = (models) => {
  AuditCycle.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
  AuditCycle.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
  AuditCycle.hasMany(models.AuditAuditor, { foreignKey: 'auditCycleId', as: 'auditors' });
  AuditCycle.hasMany(models.AuditResult, { foreignKey: 'auditCycleId', as: 'results' });
  AuditCycle.hasMany(models.AuditDiscrepancy, { foreignKey: 'auditCycleId', as: 'discrepancies' });
};

module.exports = AuditCycle;
