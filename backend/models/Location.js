const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  code: {
    type: DataTypes.STRING,
    unique: true,
  },
  parentLocationId: {
    type: DataTypes.UUID,
    field: 'parent_location_id',
  },
  type: DataTypes.STRING,
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
  tableName: 'locations',
  timestamps: false,
});

Location.associate = (models) => {
  Location.hasMany(models.Location, { foreignKey: 'parentLocationId', as: 'children' });
  Location.belongsTo(models.Location, { foreignKey: 'parentLocationId', as: 'parent' });
  Location.hasMany(models.Asset, { foreignKey: 'locationId', as: 'assets' });
  Location.hasMany(models.AuditCycle, { foreignKey: 'locationId', as: 'auditCycles' });
};

module.exports = Location;
