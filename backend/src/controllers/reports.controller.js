const { Op } = require('sequelize');
const { User, Tenant, Subscription, Employee, Attendance, Leave, Payroll } = require('../models');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { sendEmail } = require('../utils/email');
const cron = require('node-cron');

// Store for scheduled reports
const scheduledReports = new Map();

const generateSystemReport = async (req, res) => {
  try {
    const { reportType, dateRange, format, filters = {} } = req.body;
    
    const startDate = dateRange?.start ? new Date(dateRange.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = dateRange?.end ? new Date(dateRange.end) : new Date();

    let reportData = {};

    switch (reportType) {
      case 'employees':
        reportData = await generateEmployeeReport(startDate, endDate, filters);
        break;
      case 'attendance':
        reportData = await generateAttendanceReport(startDate, endDate, filters);
        break;
      case 'leave':
        reportData = await generateLeaveReport(startDate, endDate, filters);
        break;
      case 'payroll':
        reportData = await generatePayrollReport(startDate, endDate, filters);
        break;
      case 'user_activity':
        reportData = await generateUserActivityReport(startDate, endDate);
        break;
      case 'tenant_growth':
        reportData = await generateTenantGrowthReport(startDate, endDate);
        break;
      case 'subscription_revenue':
        reportData = await generateSubscriptionRevenueReport(startDate, endDate);
        break;
      case 'system_usage':
        reportData = await generateSystemUsageReport(startDate, endDate);
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    // Format response based on requested format
    if (format === 'csv') {
      const csv = convertToCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}_report.csv"`);
      return res.send(csv);
    }

    if (format === 'excel') {
      const buffer = await convertToExcel(reportData, reportType);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}_report.xlsx"`);
      return res.send(buffer);
    }

    if (format === 'pdf') {
      const buffer = await convertToPDF(reportData, reportType);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}_report.pdf"`);
      return res.send(buffer);
    }

    res.json({
      reportType,
      dateRange: { startDate, endDate },
      data: reportData,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};

const generateEmployeeReport = async (startDate, endDate, filters) => {
  const whereClause = {
    createdAt: {
      [Op.between]: [startDate, endDate]
    }
  };

  if (filters.department) {
    whereClause.department = filters.department;
  }
  if (filters.status) {
    whereClause.status = filters.status;
  }

  const employees = await Employee.findAll({
    where: whereClause,
    include: [{ model: Tenant, attributes: ['name'] }],
    order: [['createdAt', 'DESC']]
  });

  return {
    employees: employees.map(emp => ({
      id: emp.id,
      name: emp.firstName + ' ' + emp.lastName,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      hireDate: emp.hireDate,
      salary: emp.salary,
      status: emp.status,
      tenant: emp.Tenant?.name
    })),
    summary: {
      total: employees.length,
      byDepartment: employees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
      }, {}),
      byStatus: employees.reduce((acc, emp) => {
        acc[emp.status] = (acc[emp.status] || 0) + 1;
        return acc;
      }, {})
    }
  };
};

const generateAttendanceReport = async (startDate, endDate, filters) => {
  const whereClause = {
    date: {
      [Op.between]: [startDate, endDate]
    }
  };

  const attendance = await Attendance.findAll({
    where: whereClause,
    include: [{ 
      model: Employee, 
      attributes: ['firstName', 'lastName', 'department'],
      where: filters.department ? { department: filters.department } : {}
    }],
    order: [['date', 'DESC']]
  });

  return {
    records: attendance.map(record => ({
      employeeName: record.Employee.firstName + ' ' + record.Employee.lastName,
      department: record.Employee.department,
      date: record.date,
      checkIn: record.checkInTime,
      checkOut: record.checkOutTime,
      hoursWorked: record.hoursWorked,
      status: record.status
    })),
    summary: {
      totalRecords: attendance.length,
      avgHoursWorked: attendance.reduce((sum, record) => sum + (record.hoursWorked || 0), 0) / attendance.length,
      attendanceRate: (attendance.filter(r => r.status === 'Present').length / attendance.length * 100).toFixed(2)
    }
  };
};

const generateLeaveReport = async (startDate, endDate, filters) => {
  const whereClause = {
    startDate: {
      [Op.between]: [startDate, endDate]
    }
  };

  if (filters.status) {
    whereClause.status = filters.status;
  }

  const leaves = await Leave.findAll({
    where: whereClause,
    include: [{ 
      model: Employee, 
      attributes: ['firstName', 'lastName', 'department'] 
    }],
    order: [['startDate', 'DESC']]
  });

  return {
    requests: leaves.map(leave => ({
      employeeName: leave.Employee.firstName + ' ' + leave.Employee.lastName,
      department: leave.Employee.department,
      type: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      days: leave.totalDays,
      status: leave.status,
      reason: leave.reason
    })),
    summary: {
      total: leaves.length,
      byType: leaves.reduce((acc, leave) => {
        acc[leave.leaveType] = (acc[leave.leaveType] || 0) + 1;
        return acc;
      }, {}),
      byStatus: leaves.reduce((acc, leave) => {
        acc[leave.status] = (acc[leave.status] || 0) + 1;
        return acc;
      }, {})
    }
  };
};

const generatePayrollReport = async (startDate, endDate, filters) => {
  const whereClause = {
    payPeriodStart: {
      [Op.between]: [startDate, endDate]
    }
  };

  const payrolls = await Payroll.findAll({
    where: whereClause,
    include: [{ 
      model: Employee, 
      attributes: ['firstName', 'lastName', 'department'] 
    }],
    order: [['payPeriodStart', 'DESC']]
  });

  return {
    records: payrolls.map(payroll => ({
      employeeName: payroll.Employee.firstName + ' ' + payroll.Employee.lastName,
      department: payroll.Employee.department,
      period: `${payroll.payPeriodStart} - ${payroll.payPeriodEnd}`,
      basicSalary: payroll.basicSalary,
      overtime: payroll.overtimePay,
      deductions: payroll.deductions,
      netPay: payroll.netPay
    })),
    summary: {
      totalRecords: payrolls.length,
      totalPayout: payrolls.reduce((sum, p) => sum + (p.netPay || 0), 0),
      avgSalary: payrolls.reduce((sum, p) => sum + (p.basicSalary || 0), 0) / payrolls.length
    }
  };
};

const generateUserActivityReport = async (startDate, endDate) => {
  const users = await User.count({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    },
    group: ['role'],
    attributes: ['role']
  });

  const totalUsers = await User.count();
  const activeUsers = await User.count({
    where: {
      lastLogin: {
        [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  });

  return {
    totalUsers,
    activeUsers,
    newUsers: users,
    activityRate: totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(2) : 0
  };
};

const generateTenantGrowthReport = async (startDate, endDate) => {
  const tenants = await Tenant.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    },
    attributes: ['createdAt', 'status', 'plan'],
    order: [['createdAt', 'ASC']]
  });

  const totalTenants = await Tenant.count();
  const activeTenants = await Tenant.count({ where: { status: 'Active' } });

  return {
    totalTenants,
    activeTenants,
    newTenants: tenants.length,
    tenantsByPlan: tenants.reduce((acc, tenant) => {
      acc[tenant.plan] = (acc[tenant.plan] || 0) + 1;
      return acc;
    }, {}),
    growthTimeline: tenants
  };
};

const generateSubscriptionRevenueReport = async (startDate, endDate) => {
  const subscriptions = await Subscription.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    },
    include: [{ model: Tenant, attributes: ['name'] }]
  });

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active').length;

  return {
    totalRevenue,
    activeSubscriptions,
    subscriptionsByPlan: subscriptions.reduce((acc, sub) => {
      acc[sub.plan] = (acc[sub.plan] || 0) + (sub.amount || 0);
      return acc;
    }, {}),
    revenueTimeline: subscriptions
  };
};

const generateSystemUsageReport = async (startDate, endDate) => {
  // Mock system usage data - in real implementation, this would come from monitoring tools
  return {
    cpuUsage: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 40) + 30
    })),
    memoryUsage: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 30) + 50
    })),
    storageUsage: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 20) + 60
    }))
  };
};

const convertToCSV = (data) => {
  if (!data || typeof data !== 'object') return '';
  
  let csvContent = '';
  
  // Handle different data structures
  if (data.employees) {
    const headers = ['Name', 'Email', 'Department', 'Position', 'Hire Date', 'Status'];
    csvContent = headers.join(',') + '\n';
    data.employees.forEach(emp => {
      csvContent += [emp.name, emp.email, emp.department, emp.position, emp.hireDate, emp.status].join(',') + '\n';
    });
  } else if (data.records) {
    const firstRecord = data.records[0];
    if (firstRecord) {
      const headers = Object.keys(firstRecord);
      csvContent = headers.join(',') + '\n';
      data.records.forEach(record => {
        csvContent += headers.map(h => record[h] || '').join(',') + '\n';
      });
    }
  }
  
  return csvContent;
};

const convertToExcel = async (data, reportType) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(reportType);

  // Add data based on report type
  if (data.employees) {
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Position', key: 'position', width: 20 },
      { header: 'Hire Date', key: 'hireDate', width: 12 },
      { header: 'Status', key: 'status', width: 10 }
    ];
    worksheet.addRows(data.employees);
  } else if (data.records) {
    const firstRecord = data.records[0];
    if (firstRecord) {
      worksheet.columns = Object.keys(firstRecord).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 15
      }));
      worksheet.addRows(data.records);
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

const convertToPDF = async (data, reportType) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    doc.fontSize(16).text(`${reportType.toUpperCase()} Report`, 50, 50);
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);

    let yPos = 120;
    
    if (data.employees) {
      data.employees.forEach(emp => {
        doc.text(`${emp.name} - ${emp.department} - ${emp.status}`, 50, yPos);
        yPos += 20;
      });
    } else if (data.records) {
      data.records.slice(0, 20).forEach(record => { // Limit for PDF
        const text = Object.values(record).join(' | ');
        doc.text(text.substring(0, 100), 50, yPos);
        yPos += 20;
      });
    }

    doc.end();
  });
};

const scheduleReport = async (req, res) => {
  try {
    const { reportConfig, schedule } = req.body;
    const { frequency, recipients, enabled } = schedule;

    if (!enabled) {
      return res.json({ message: 'Report scheduling disabled' });
    }

    const cronExpression = getCronExpression(frequency);
    const reportId = `report_${Date.now()}`;

    const task = cron.schedule(cronExpression, async () => {
      try {
        // Generate report
        const reportData = await generateReportData(reportConfig);
        const buffer = await convertToExcel(reportData, reportConfig.dataSource);

        // Send email to recipients
        for (const recipient of recipients) {
          await sendEmail({
            to: recipient,
            subject: `Scheduled Report: ${reportConfig.name}`,
            text: `Please find attached the scheduled report: ${reportConfig.name}`,
            attachments: [{
              filename: `${reportConfig.name}.xlsx`,
              content: buffer
            }]
          });
        }
      } catch (error) {
        console.error('Scheduled report generation failed:', error);
      }
    });

    scheduledReports.set(reportId, task);

    res.json({ reportId, message: 'Report scheduled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to schedule report', error: error.message });
  }
};

const getCronExpression = (frequency) => {
  switch (frequency) {
    case 'daily': return '0 9 * * *'; // 9 AM daily
    case 'weekly': return '0 9 * * 1'; // 9 AM every Monday
    case 'monthly': return '0 9 1 * *'; // 9 AM on 1st of every month
    default: return '0 9 * * 1'; // Default to weekly
  }
};

const generateReportData = async (config) => {
  const { dataSource, filters = {} } = config;
  const startDate = filters.dateRange?.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = filters.dateRange?.to || new Date();

  switch (dataSource) {
    case 'employees':
      return await generateEmployeeReport(startDate, endDate, filters);
    case 'attendance':
      return await generateAttendanceReport(startDate, endDate, filters);
    case 'leave':
      return await generateLeaveReport(startDate, endDate, filters);
    case 'payroll':
      return await generatePayrollReport(startDate, endDate, filters);
    default:
      throw new Error('Invalid data source');
  }
};

const getAvailableReports = async (req, res) => {
  try {
    const reports = [
      {
        id: 'employees',
        name: 'Employee Report',
        description: 'Comprehensive employee data and statistics',
        category: 'HR',
        fields: ['id', 'name', 'email', 'department', 'position', 'hireDate', 'salary', 'status']
      },
      {
        id: 'attendance',
        name: 'Attendance Report',
        description: 'Employee attendance tracking and analytics',
        category: 'Attendance',
        fields: ['employeeName', 'department', 'date', 'checkIn', 'checkOut', 'hoursWorked', 'status']
      },
      {
        id: 'leave',
        name: 'Leave Report',
        description: 'Leave requests and balance tracking',
        category: 'Leave',
        fields: ['employeeName', 'type', 'startDate', 'endDate', 'days', 'status', 'reason']
      },
      {
        id: 'payroll',
        name: 'Payroll Report',
        description: 'Payroll processing and salary analytics',
        category: 'Payroll',
        fields: ['employeeName', 'period', 'basicSalary', 'overtime', 'deductions', 'netPay']
      },
      {
        id: 'user_activity',
        name: 'User Activity Report',
        description: 'Detailed user registration and activity metrics',
        category: 'Users'
      },
      {
        id: 'tenant_growth',
        name: 'Tenant Growth Report',
        description: 'Tenant registration and growth analysis',
        category: 'Tenants'
      },
      {
        id: 'subscription_revenue',
        name: 'Subscription Revenue Report',
        description: 'Revenue analysis by subscription plans',
        category: 'Billing'
      },
      {
        id: 'system_usage',
        name: 'System Usage Report',
        description: 'System resource utilization metrics',
        category: 'System'
      }
    ];

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch available reports', error: error.message });
  }
};

module.exports = {
  generateSystemReport,
  getAvailableReports,
  scheduleReport
};
