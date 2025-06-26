
const { User, Tenant, Subscription } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalTenants = await Tenant.count();
    const totalUsers = await User.count();
    const activeSubscriptions = await Subscription.count({
      where: { status: 'Active' }
    });

    // Get monthly growth
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const newTenantsThisMonth = await Tenant.count({
      where: {
        createdAt: {
          [Op.gte]: lastMonth
        }
      }
    });

    const newUsersThisMonth = await User.count({
      where: {
        createdAt: {
          [Op.gte]: lastMonth
        }
      }
    });

    const lastMonthTenants = totalTenants - newTenantsThisMonth;
    const lastMonthUsers = totalUsers - newUsersThisMonth;

    const tenantGrowth = lastMonthTenants > 0 ? ((newTenantsThisMonth / lastMonthTenants) * 100) : 0;
    const userGrowth = lastMonthUsers > 0 ? ((newUsersThisMonth / lastMonthUsers) * 100) : 0;

    // System health (mock for now)
    const systemHealth = 98;

    res.json({
      totalTenants,
      activeSubscriptions,
      totalUsers,
      systemHealth,
      trends: {
        tenantGrowth: Math.round(tenantGrowth * 10) / 10,
        userGrowth: Math.round(userGrowth * 10) / 10,
        subscriptionGrowth: 8.2
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics', error: error.message });
  }
};

const getSystemUsage = async (req, res) => {
  try {
    // Mock system usage data - in real implementation, this would come from monitoring tools
    const usageData = [
      { date: '2023-05-01', cpu: 45, memory: 62, storage: 38 },
      { date: '2023-05-02', cpu: 52, memory: 58, storage: 42 },
      { date: '2023-05-03', cpu: 38, memory: 65, storage: 35 },
      { date: '2023-05-04', cpu: 48, memory: 60, storage: 45 },
      { date: '2023-05-05', cpu: 55, memory: 63, storage: 48 },
      { date: '2023-05-06', cpu: 42, memory: 57, storage: 40 },
      { date: '2023-05-07', cpu: 49, memory: 61, storage: 43 }
    ];

    res.json(usageData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system usage', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getSystemUsage
};
