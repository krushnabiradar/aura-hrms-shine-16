
const { Op } = require('sequelize');
const { User, Tenant, Subscription, SystemSettings } = require('../models');

const generateSystemReport = async (req, res) => {
  try {
    const { reportType, dateRange, format } = req.body;
    
    const startDate = dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = dateRange?.end || new Date();

    let reportData = {};

    switch (reportType) {
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
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}_report.csv"`);
      return res.send(convertToCSV(reportData));
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
  
  const flattenObject = (obj, prefix = '') => {
    let result = {};
    for (let key in obj) {
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key], prefix + key + '_'));
      } else {
        result[prefix + key] = obj[key];
      }
    }
    return result;
  };

  const flattened = flattenObject(data);
  const headers = Object.keys(flattened).join(',');
  const values = Object.values(flattened).join(',');
  
  return `${headers}\n${values}`;
};

const getAvailableReports = async (req, res) => {
  try {
    const reports = [
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
  getAvailableReports
};
