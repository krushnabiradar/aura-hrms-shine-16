const express = require('express');
const { createTenant, getTenants, updateTenant } = require('../controllers/tenant.controller');
const { createUser, getUsers, updateUser } = require('../controllers/user.controller');
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { getSecuritySettings, updateSecuritySettings, getSecurityLogs } = require('../controllers/security.controller');
const { getSubscriptions, updateSubscription } = require('../controllers/billing.controller');
const auth = require('../middleware/auth');
const systemAdminAuth = require('../middleware/system-admin-auth');

const router = express.Router();

// Apply system admin authentication middleware to all routes
router.use(auth, systemAdminAuth);

// Tenant routes
router.post('/tenants', createTenant);
router.get('/tenants', getTenants);
router.put('/tenants/:id', updateTenant);

// User routes
router.post('/users', createUser);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Security routes
router.get('/security/settings', getSecuritySettings);
router.put('/security/settings', updateSecuritySettings);
router.get('/security/logs', getSecurityLogs);

// Billing routes
router.get('/subscriptions', getSubscriptions);
router.put('/subscriptions/:id', updateSubscription);

module.exports = router;