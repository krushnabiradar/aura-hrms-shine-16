
const { User, Tenant } = require('../models');
const { Op } = require('sequelize');

const getSystemLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, level, action, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    // Mock system logs - in real implementation, this would come from a logging system
    const mockLogs = [
      {
        id: 1,
        timestamp: new Date(),
        level: 'INFO',
        action: 'USER_LOGIN',
        message: 'User admin@system.com logged in successfully',
        userId: 'user-1',
        userEmail: 'admin@system.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 3600000),
        level: 'WARNING',
        action: 'TENANT_UPDATE',
        message: 'Tenant settings updated',
        userId: 'user-2',
        userEmail: 'admin@acme.com',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0...'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 7200000),
        level: 'ERROR',
        action: 'SUBSCRIPTION_FAILED',
        message: 'Subscription payment failed for tenant ABC Corp',
        userId: null,
        userEmail: 'billing@system.com',
        ipAddress: '10.0.0.1',
        userAgent: 'System Process'
      }
    ];

    // Apply filters
    let filteredLogs = mockLogs;
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action.includes(action));
    }

    const totalItems = filteredLogs.length;
    const logs = filteredLogs.slice(offset, offset + parseInt(limit));

    res.json({
      logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system logs', error: error.message });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, tenantId, action } = req.query;
    const offset = (page - 1) * limit;

    // Get recent user activities
    const recentUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'lastLogin', 'updatedAt'],
      include: [{
        model: require('./tenant.controller').Tenant,
        attributes: ['name'],
        required: false
      }],
      order: [['updatedAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    const auditLogs = recentUsers.map(user => ({
      id: user.id,
      timestamp: user.updatedAt,
      action: 'USER_ACTIVITY',
      message: `User ${user.name} activity recorded`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      tenantName: user.Tenant?.name || 'System',
      lastLogin: user.lastLogin
    }));

    const totalUsers = await User.count();

    res.json({
      logs: auditLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalItems: totalUsers,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message });
  }
};

module.exports = {
  getSystemLogs,
  getAuditLogs
};
