const { SystemSettings, User } = require('../models');
const bcrypt = require('bcryptjs');

const getSecuritySettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();
    res.json(settings?.security || {});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch security settings', error: error.message });
  }
};

const updateSecuritySettings = async (req, res) => {
  try {
    const { passwordPolicy, mfaEnabled, sessionTimeout, ipWhitelist } = req.body;

    const [settings] = await SystemSettings.upsert({
      security: {
        passwordPolicy,
        mfaEnabled,
        sessionTimeout,
        ipWhitelist
      }
    });

    res.json(settings.security);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update security settings', error: error.message });
  }
};

const getSecurityLogs = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'lastLogin', 'status'],
      order: [['lastLogin', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch security logs', error: error.message });
  }
};

module.exports = {
  getSecuritySettings,
  updateSecuritySettings,
  getSecurityLogs
};