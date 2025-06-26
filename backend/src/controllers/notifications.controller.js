
const { SystemSettings } = require('../models');

const getNotificationSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();
    const notifications = settings?.notifications || {
      email: {
        enabled: true,
        newTenant: true,
        userRegistration: true,
        paymentFailed: true,
        systemAlerts: true
      },
      sms: {
        enabled: false,
        criticalAlerts: false
      },
      push: {
        enabled: true,
        dashboardAlerts: true,
        securityAlerts: true
      }
    };

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notification settings', error: error.message });
  }
};

const updateNotificationSettings = async (req, res) => {
  try {
    const { email, sms, push } = req.body;

    const [settings] = await SystemSettings.upsert({
      notifications: {
        email,
        sms,
        push
      }
    });

    res.json(settings.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification settings', error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const offset = (page - 1) * limit;

    // Mock notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'info',
        title: 'New Tenant Registration',
        message: 'ABC Corp has registered as a new tenant',
        timestamp: new Date(),
        read: false,
        priority: 'medium'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Payment Failed',
        message: 'Payment failed for XYZ Inc subscription',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        priority: 'high'
      },
      {
        id: 3,
        type: 'success',
        title: 'System Update Complete',
        message: 'System maintenance completed successfully',
        timestamp: new Date(Date.now() - 7200000),
        read: true,
        priority: 'low'
      }
    ];

    let filteredNotifications = mockNotifications;
    
    if (unreadOnly === 'true') {
      filteredNotifications = filteredNotifications.filter(n => !n.read);
    }

    const totalItems = filteredNotifications.length;
    const notifications = filteredNotifications.slice(offset, offset + parseInt(limit));

    res.json({
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: parseInt(limit)
      },
      unreadCount: mockNotifications.filter(n => !n.read).length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

module.exports = {
  getNotificationSettings,
  updateNotificationSettings,
  getNotifications
};
