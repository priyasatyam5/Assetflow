const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const AuditAuditor = sequelize.define('AuditAuditor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  auditCycleId: {
    type: DataTypes.UUID,
    field: 'audit_cycle_id',
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
}, {
  tableName: 'audit_auditors',
  timestamps: false,
});

AuditAuditor.associate = (models) => {
  AuditAuditor.belongsTo(models.AuditCycle, { foreignKey: 'auditCycleId', as: 'auditCycle' });
  AuditAuditor.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = AuditAuditor;
