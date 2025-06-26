
const Tenant = require('./Tenant');
const Subscription = require('./Subscription');
const User = require('./User');
const Employee = require('./Employee');
const Attendance = require('./Attendance');
const Leave = require('./Leave');
const Payroll = require('./Payroll');
const SystemSettings = require('./SystemSettings');

// Define associations
Tenant.hasMany(User, { foreignKey: 'tenantId', as: 'users' });
User.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

Tenant.hasMany(Employee, { foreignKey: 'tenantId', as: 'employees' });
Employee.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

Tenant.hasOne(Subscription, { foreignKey: 'tenantId', as: 'subscription' });
Subscription.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

User.hasOne(Employee, { foreignKey: 'userId', as: 'employee' });
Employee.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Employee.hasMany(Attendance, { foreignKey: 'employeeId', as: 'attendances' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

Employee.hasMany(Leave, { foreignKey: 'employeeId', as: 'leaves' });
Leave.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

Employee.hasMany(Payroll, { foreignKey: 'employeeId', as: 'payrolls' });
Payroll.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

module.exports = {
  Tenant,
  Subscription,
  User,
  Employee,
  Attendance,
  Leave,
  Payroll,
  SystemSettings
};
