const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Department = sequelize.define('Department', {
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
  parentDepartmentId: {
    type: DataTypes.UUID,
    field: 'parent_department_id',
  },
  departmentHeadId: {
    type: DataTypes.UUID,
    field: 'department_head_id',
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
  tableName: 'departments',
  timestamps: false,
});

Department.associate = (models) => {
  Department.hasMany(models.User, { foreignKey: 'departmentId', as: 'users' });
  Department.hasMany(models.Department, { foreignKey: 'parentDepartmentId', as: 'children' });
  Department.belongsTo(models.Department, { foreignKey: 'parentDepartmentId', as: 'parent' });
  Department.belongsTo(models.User, { foreignKey: 'departmentHeadId', as: 'head' });
};

module.exports = Department;
