const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
  },
  title: DataTypes.STRING,
  message: DataTypes.TEXT,
  type: DataTypes.STRING,
  read: DataTypes.BOOLEAN,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
}, {
  tableName: 'notifications',
  timestamps: false,
});

Notification.associate = (models) => {
  Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Notification;
