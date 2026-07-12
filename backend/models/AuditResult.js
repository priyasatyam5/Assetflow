const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const AuditResult = sequelize.define('AuditResult', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  auditCycleId: {
    type: DataTypes.UUID,
    field: 'audit_cycle_id',
  },
  assetId: {
    type: DataTypes.UUID,
    field: 'asset_id',
  },
  auditorId: {
    type: DataTypes.UUID,
    field: 'auditor_id',
  },
  status: DataTypes.STRING,
  notes: DataTypes.TEXT,
  checkedAt: {
    type: DataTypes.DATE,
    field: 'checked_at',
  },
}, {
  tableName: 'audit_results',
  timestamps: false,
});

AuditResult.associate = (models) => {
  AuditResult.belongsTo(models.AuditCycle, { foreignKey: 'auditCycleId', as: 'auditCycle' });
  AuditResult.belongsTo(models.Asset, { foreignKey: 'assetId', as: 'asset' });
  AuditResult.belongsTo(models.User, { foreignKey: 'auditorId', as: 'auditor' });
};

module.exports = AuditResult;
