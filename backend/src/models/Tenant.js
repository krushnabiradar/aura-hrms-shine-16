
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Tenant extends Model {}

Tenant.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  adminEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  maxUsers: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  storage: {
    type: DataTypes.STRING,
    defaultValue: '1GB'
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
    defaultValue: 'Active'
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      autoActivation: true,
      emailNotifications: true,
      trialPeriod: true
    }
  }
}, {
  sequelize,
  modelName: 'Tenant',
  timestamps: true
});

module.exports = Tenant;
