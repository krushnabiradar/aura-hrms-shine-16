const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Employee extends Model {}

Employee.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Tenants',
      key: 'id'
    }
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: DataTypes.STRING,
  position: DataTypes.STRING,
  joinDate: DataTypes.DATE,
  employmentStatus: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Intern'),
    defaultValue: 'Full-time'
  },
  personalInfo: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  sequelize,
  modelName: 'Employee',
  timestamps: true
});

module.exports = Employee;