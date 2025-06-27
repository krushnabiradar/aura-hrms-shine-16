
const { SystemSettings } = require('../models');
const { sendEmail } = require('../utils/email');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

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
    const { general, security, email, integrations, maintenance, notifications } = req.body;

    // Validate settings data
    const validationErrors = validateSettings({ general, security, email, integrations, maintenance, notifications });
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    const [settings] = await SystemSettings.upsert({
      general,
      security,
      email,
      integrations,
      maintenance,
      notifications
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const logoUrl = `/uploads/${req.file.filename}`;
    
    // Update settings with new logo URL
    const settings = await SystemSettings.findOne();
    if (settings) {
      const updatedGeneral = {
        ...settings.general,
        companyLogo: logoUrl
      };
      
      await SystemSettings.update(
        { general: updatedGeneral },
        { where: { id: settings.id } }
      );
    }

    res.json({ logoUrl, message: 'Logo uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload logo', error: error.message });
  }
};

const testEmailConfig = async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail, testEmail } = req.body;

    if (!testEmail) {
      return res.status(400).json({ message: 'Test email address is required' });
    }

    // Create test transporter
    const transporter = nodemailer.createTransporter({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword
      }
    });

    // Verify connection
    await transporter.verify();

    // Send test email
    await transporter.sendMail({
      from: fromEmail,
      to: testEmail,
      subject: 'HRMS Email Configuration Test',
      text: 'This is a test email to verify your SMTP configuration is working correctly.',
      html: '<p>This is a test email to verify your SMTP configuration is working correctly.</p>'
    });

    res.json({ message: 'Email configuration test successful' });
  } catch (error) {
    res.status(400).json({ 
      message: 'Email configuration test failed', 
      error: error.message 
    });
  }
};

const validateSettings = (settings) => {
  const errors = [];

  // Validate general settings
  if (settings.general) {
    if (settings.general.companyName && settings.general.companyName.length < 2) {
      errors.push('Company name must be at least 2 characters long');
    }
    if (settings.general.timezone && !isValidTimezone(settings.general.timezone)) {
      errors.push('Invalid timezone');
    }
  }

  // Validate security settings
  if (settings.security?.passwordPolicy) {
    const policy = settings.security.passwordPolicy;
    if (policy.minLength < 4 || policy.minLength > 128) {
      errors.push('Password minimum length must be between 4 and 128 characters');
    }
    if (policy.expiryDays < 1 || policy.expiryDays > 365) {
      errors.push('Password expiry days must be between 1 and 365');
    }
  }

  // Validate email settings
  if (settings.email) {
    if (settings.email.smtpPort && (settings.email.smtpPort < 1 || settings.email.smtpPort > 65535)) {
      errors.push('SMTP port must be between 1 and 65535');
    }
    if (settings.email.fromEmail && !isValidEmail(settings.email.fromEmail)) {
      errors.push('Invalid from email address');
    }
  }

  return errors;
};

const isValidTimezone = (timezone) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  getSettings,
  updateSettings,
  uploadLogo,
  testEmailConfig
};
