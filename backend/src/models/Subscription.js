
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Subscription extends Model {}

Subscription.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Tenants',
      key: 'id'
    }
  },
  plan: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Basic'
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Cancelled', 'Past_Due'),
    defaultValue: 'Active'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  billingCycle: {
    type: DataTypes.ENUM('Monthly', 'Yearly'),
    defaultValue: 'Monthly'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  }
}, {
  sequelize,
  modelName: 'Subscription',
  timestamps: true
});

module.exports = Subscription;
