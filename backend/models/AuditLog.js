const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
  },
  action: DataTypes.STRING,
  targetTable: {
    type: DataTypes.STRING,
    field: 'target_table',
  },
  targetId: {
    type: DataTypes.UUID,
    field: 'target_id',
  },
  details: DataTypes.JSON,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
}, {
  tableName: 'audit_logs',
  timestamps: false,
});

AuditLog.associate = (models) => {
  AuditLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = AuditLog;
