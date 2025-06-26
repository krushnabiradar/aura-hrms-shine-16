const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SystemSettings extends Model {}

SystemSettings.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  general: {
    type: DataTypes.JSONB,
    defaultValue: {
      companyName: '',
      companyLogo: '',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      currency: 'USD',
      language: 'en'
    }
  },
  security: {
    type: DataTypes.JSONB,
    defaultValue: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        expiryDays: 90
      },
      sessionTimeout: 30,
      twoFactorAuth: false,
      ipWhitelist: []
    }
  },
  email: {
    type: DataTypes.JSONB,
    defaultValue: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: '',
      emailSignature: ''
    }
  },
  integrations: {
    type: DataTypes.JSONB,
    defaultValue: {
      payrollProvider: '',
      attendanceSystem: '',
      sso: {
        enabled: false,
        provider: '',
        clientId: '',
        clientSecret: ''
      }
    }
  },
  maintenance: {
    type: DataTypes.JSONB,
    defaultValue: {
      backupFrequency: 'daily',
      retentionPeriod: 30,
      maintenanceMode: false,
      debugMode: false
    }
  }
}, {
  sequelize,
  modelName: 'SystemSettings',
  timestamps: true
});

module.exports = SystemSettings;