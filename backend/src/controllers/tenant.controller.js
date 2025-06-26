const { Tenant, User, Subscription } = require('../models');
const crypto = require('crypto');

const createTenant = async (req, res) => {
  try {
    const { name, domain, adminEmail, adminName, plan } = req.body;

    // Create tenant
    const tenant = await Tenant.create({
      name,
      domain,
      status: 'Active',
      settings: {}
    });

    // Create tenant admin user
    const adminUser = await User.create({
      name: adminName,  // This is causing the error because adminName is null
      email: adminEmail,
      password: crypto.randomBytes(20).toString('hex'),
      role: 'tenant_admin',
      tenantId: tenant.id,
      status: 'Active'
    });

    // Create subscription
    await Subscription.create({
      tenantId: tenant.id,
      plan,
      status: 'Active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      billingCycle: 'Monthly'
    });

    res.status(201).json({
      tenant,
      adminUser: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tenant', error: error.message });
  }
};

const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      include: [{
        model: Subscription,
        attributes: ['plan', 'status', 'endDate']
      }]
    });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tenants', error: error.message });
  }
};

const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, domain, status, settings } = req.body;

    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    await tenant.update({
      name,
      domain,
      status,
      settings
    });

    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update tenant', error: error.message });
  }
};

module.exports = {
  createTenant,
  getTenants,
  updateTenant
};