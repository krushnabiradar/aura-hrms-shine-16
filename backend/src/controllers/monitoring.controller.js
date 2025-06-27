
const { Op } = require('sequelize');
const { User, Tenant, Subscription } = require('../models');

const getSystemMetrics = async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // System health metrics
    const totalTenants = await Tenant.count();
    const activeTenants = await Tenant.count({ where: { status: 'Active' } });
    const totalUsers = await User.count();
    const activeUsers = await User.count({
      where: {
        lastLogin: {
          [Op.gte]: oneWeekAgo
        }
      }
    });

    // Recent activity
    const newTenantsToday = await Tenant.count({
      where: {
        createdAt: {
          [Op.gte]: oneDayAgo
        }
      }
    });

    const newUsersToday = await User.count({
      where: {
        createdAt: {
          [Op.gte]: oneDayAgo
        }
      }
    });

    // Failed login attempts (mock data - would integrate with auth system)
    const failedLogins = Math.floor(Math.random() * 20) + 5;

    // System resource usage (mock data - would integrate with monitoring tools)
    const systemUsage = {
      cpu: Math.floor(Math.random() * 40) + 30,
      memory: Math.floor(Math.random() * 30) + 50,
      storage: Math.floor(Math.random() * 20) + 60,
      network: Math.floor(Math.random() * 50) + 25
    };

    // Database metrics (mock data)
    const databaseMetrics = {
      connections: Math.floor(Math.random() * 50) + 10,
      queryTime: Math.floor(Math.random() * 100) + 50,
      cacheHitRatio: Math.floor(Math.random() * 20) + 80
    };

    const metrics = {
      system: {
        health: activeTenants > 0 ? Math.min(95, Math.floor((activeTenants / totalTenants) * 100)) : 100,
        uptime: '99.9%',
        lastUpdated: now.toISOString()
      },
      tenants: {
        total: totalTenants,
        active: activeTenants,
        newToday: newTenantsToday,
        growthRate: totalTenants > 0 ? ((newTenantsToday / totalTenants) * 100).toFixed(2) : 0
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
        activeRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0
      },
      security: {
        failedLogins,
        activeSessions: Math.floor(Math.random() * 200) + 50,
        twoFactorEnabled: Math.floor(Math.random() * 30) + 70
      },
      resources: systemUsage,
      database: databaseMetrics
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system metrics', error: error.message });
  }
};

const getPerformanceMetrics = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    let dataPoints = 24;
    let interval = 60; // minutes
    
    switch (timeRange) {
      case '7d':
        dataPoints = 7;
        interval = 1440; // daily
        break;
      case '30d':
        dataPoints = 30;
        interval = 1440; // daily
        break;
      case '1h':
        dataPoints = 60;
        interval = 1; // every minute
        break;
    }

    // Generate mock performance data
    const performanceData = Array.from({ length: dataPoints }, (_, i) => {
      const timestamp = new Date(Date.now() - (dataPoints - 1 - i) * interval * 60 * 1000);
      return {
        timestamp: timestamp.toISOString(),
        cpu: Math.floor(Math.random() * 40) + 30,
        memory: Math.floor(Math.random() * 30) + 50,
        storage: Math.floor(Math.random() * 20) + 60,
        network: Math.floor(Math.random() * 50) + 25,
        responseTime: Math.floor(Math.random() * 200) + 100,
        throughput: Math.floor(Math.random() * 1000) + 500
      };
    });

    res.json({
      timeRange,
      dataPoints: performanceData,
      summary: {
        avgCpu: performanceData.reduce((sum, d) => sum + d.cpu, 0) / performanceData.length,
        avgMemory: performanceData.reduce((sum, d) => sum + d.memory, 0) / performanceData.length,
        avgResponseTime: performanceData.reduce((sum, d) => sum + d.responseTime, 0) / performanceData.length,
        avgThroughput: performanceData.reduce((sum, d) => sum + d.throughput, 0) / performanceData.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch performance metrics', error: error.message });
  }
};

const getSystemAlerts = async (req, res) => {
  try {
    // Mock system alerts - in real implementation, this would come from monitoring system
    const alerts = [
      {
        id: 1,
        type: 'warning',
        title: 'High CPU Usage',
        message: 'CPU usage has been above 80% for the last 10 minutes',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        resolved: false
      },
      {
        id: 2,
        type: 'info',
        title: 'Database Backup Completed',
        message: 'Scheduled database backup completed successfully',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolved: true
      },
      {
        id: 3,
        type: 'error',
        title: 'Failed Login Attempts',
        message: 'Multiple failed login attempts detected from IP 192.168.1.100',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        resolved: false
      }
    ];

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system alerts', error: error.message });
  }
};

module.exports = {
  getSystemMetrics,
  getPerformanceMetrics,
  getSystemAlerts
};
