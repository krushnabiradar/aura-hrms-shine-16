
const express = require('express');
const { createTenant, getTenants, updateTenant } = require('../controllers/tenant.controller');
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/user.controller');
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { getSecuritySettings, updateSecuritySettings, getSecurityLogs } = require('../controllers/security.controller');
const { getSubscriptions, createSubscription, updateSubscription, deleteSubscription } = require('../controllers/billing.controller');
const { getDashboardStats, getSystemUsage } = require('../controllers/dashboard.controller');
const { getSystemLogs, getAuditLogs } = require('../controllers/logs.controller');
const { getNotificationSettings, updateNotificationSettings, getNotifications } = require('../controllers/notifications.controller');
const { generateSystemReport, getAvailableReports } = require('../controllers/reports.controller');
const { getSystemMetrics, getPerformanceMetrics, getSystemAlerts } = require('../controllers/monitoring.controller');
const { getSupportTickets, createSupportTicket, updateSupportTicket, getKnowledgeBase, createKnowledgeArticle, getSupportStats } = require('../controllers/support.controller');
const auth = require('../middleware/auth');
const systemAdminAuth = require('../middleware/system-admin-auth');

const router = express.Router();

// Apply system admin authentication middleware to all routes
router.use(auth, systemAdminAuth);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/usage', getSystemUsage);

// Tenant routes
router.post('/tenants', createTenant);
router.get('/tenants', getTenants);
router.put('/tenants/:id', updateTenant);

// User routes
router.post('/users', createUser);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Security routes
router.get('/security/settings', getSecuritySettings);
router.put('/security/settings', updateSecuritySettings);
router.get('/security/logs', getSecurityLogs);

// System logs routes
router.get('/logs', getSystemLogs);
router.get('/logs/audit', getAuditLogs);

// Notification routes
router.get('/notifications/settings', getNotificationSettings);
router.put('/notifications/settings', updateNotificationSettings);
router.get('/notifications', getNotifications);

// Billing/Subscription routes
router.get('/subscriptions', getSubscriptions);
router.post('/subscriptions', createSubscription);
router.put('/subscriptions/:id', updateSubscription);
router.delete('/subscriptions/:id', deleteSubscription);

// Reports routes
router.get('/reports/available', getAvailableReports);
router.post('/reports/generate', generateSystemReport);

// Monitoring routes
router.get('/monitoring/metrics', getSystemMetrics);
router.get('/monitoring/performance', getPerformanceMetrics);
router.get('/monitoring/alerts', getSystemAlerts);

// Support routes
router.get('/support/tickets', getSupportTickets);
router.post('/support/tickets', createSupportTicket);
router.put('/support/tickets/:id', updateSupportTicket);
router.get('/support/knowledge-base', getKnowledgeBase);
router.post('/support/knowledge-base', createKnowledgeArticle);
router.get('/support/stats', getSupportStats);

module.exports = router;
