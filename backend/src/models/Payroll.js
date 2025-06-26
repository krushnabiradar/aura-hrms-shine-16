const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Payroll extends Model {}

Payroll.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Employees',
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
  period: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  basicSalary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  allowances: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  deductions: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  netSalary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Processing', 'Completed', 'Error'),
    defaultValue: 'Draft'
  },
  paymentDate: DataTypes.DATE,
  paymentReference: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Payroll',
  timestamps: true
});

module.exports = Payroll;