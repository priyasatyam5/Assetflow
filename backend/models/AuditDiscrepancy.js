const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const AuditDiscrepancy = sequelize.define('AuditDiscrepancy', {
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
  description: DataTypes.TEXT,
  resolved: DataTypes.BOOLEAN,
  resolvedAt: {
    type: DataTypes.DATE,
    field: 'resolved_at',
  },
  resolvedById: {
    type: DataTypes.UUID,
    field: 'resolved_by_id',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
}, {
  tableName: 'audit_discrepancies',
  timestamps: false,
});

AuditDiscrepancy.associate = (models) => {
  AuditDiscrepancy.belongsTo(models.AuditCycle, { foreignKey: 'auditCycleId', as: 'auditCycle' });
  AuditDiscrepancy.belongsTo(models.Asset, { foreignKey: 'assetId', as: 'asset' });
  AuditDiscrepancy.belongsTo(models.User, { foreignKey: 'resolvedById', as: 'resolvedBy' });
};

module.exports = AuditDiscrepancy;
