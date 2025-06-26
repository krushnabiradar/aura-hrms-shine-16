const Tenant = require('./Tenant');
const Subscription = require('./Subscription');
const User = require('./User');
const Employee = require('./Employee');
const Attendance = require('./Attendance');
const Leave = require('./Leave');
const Payroll = require('./Payroll');
const SystemSettings = require('./SystemSettings');

// Define associations
Tenant.hasMany(User);
User.belongsTo(Tenant);

Tenant.hasMany(Employee);
Employee.belongsTo(Tenant);

Tenant.hasOne(Subscription);
Subscription.belongsTo(Tenant);

User.hasOne(Employee);
Employee.belongsTo(User);

Employee.hasMany(Attendance);
Attendance.belongsTo(Employee);

Employee.hasMany(Leave);
Leave.belongsTo(Employee);

Employee.hasMany(Payroll);
Payroll.belongsTo(Employee);

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