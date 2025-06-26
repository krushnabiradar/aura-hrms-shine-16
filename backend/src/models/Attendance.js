const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Attendance extends Model {}

Attendance.init({
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkIn: DataTypes.DATE,
  checkOut: DataTypes.DATE,
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Half-day'),
    allowNull: false
  },
  workHours: DataTypes.DECIMAL(10, 2),
  notes: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'Attendance',
  timestamps: true
});

module.exports = Attendance;