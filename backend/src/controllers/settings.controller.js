const { SystemSettings } = require('../models');

const getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { general, security, email, integrations, maintenance } = req.body;

    const [settings] = await SystemSettings.upsert({
      general,
      security,
      email,
      integrations,
      maintenance
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};