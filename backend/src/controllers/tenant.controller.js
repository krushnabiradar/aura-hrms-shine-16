
const { Tenant, User, Subscription, Employee } = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const createTenant = async (req, res) => {
  try {
    const { 
      name, 
      domain, 
      adminEmail, 
      adminName, 
      plan = 'Basic',
      description,
      maxUsers = 10,
      storage = '1GB'
    } = req.body;

    // Validate required fields
    if (!name || !domain || !adminEmail || !adminName) {
      return res.status(400).json({ 
        message: 'Name, domain, admin email, and admin name are required' 
      });
    }

    // Check if domain already exists
    const existingTenant = await Tenant.findOne({ where: { domain } });
    if (existingTenant) {
      return res.status(400).json({ message: 'Domain already exists' });
    }

    // Check if admin email already exists
    const existingUser = await User.findOne({ where: { email: adminEmail } });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin email already registered' });
    }

    // Create tenant
    const tenant = await Tenant.create({
      name,
      domain,
      adminEmail,
      description,
      maxUsers,
      storage,
      status: 'Active',
      settings: {
        autoActivation: true,
        emailNotifications: true,
        trialPeriod: true
      }
    });

    // Generate temporary password for admin user
    const tempPassword = crypto.randomBytes(12).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create tenant admin user
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'tenant_admin',
      tenantId: tenant.id,
      status: 'Active'
    });

    // Calculate subscription end date (30 days trial)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Create subscription
    const subscription = await Subscription.create({
      tenantId: tenant.id,
      plan,
      status: 'Active',
      startDate: new Date(),
      endDate,
      billingCycle: 'Monthly'
    });

    res.status(201).json({
      tenant: {
        ...tenant.toJSON(),
        employees: 0 // New tenant starts with 0 employees
      },
      adminUser: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        tempPassword // Include temp password in response for setup
      },
      subscription
    });
  } catch (error) {
    console.error('Create tenant error:', error);
    res.status(500).json({ message: 'Failed to create tenant', error: error.message });
  }
};

const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      include: [
        {
          model: Subscription,
          as: 'subscription',
          attributes: ['plan', 'status', 'endDate', 'billingCycle']
        },
        {
          model: Employee,
          as: 'employees',
          attributes: ['id']
        }
      ]
    });

    // Transform data to match frontend expectations
    const transformedTenants = tenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
      adminEmail: tenant.adminEmail,
      description: tenant.description,
      plan: tenant.subscription?.plan || 'Basic',
      maxUsers: tenant.maxUsers,
      storage: tenant.storage,
      billingCycle: tenant.subscription?.billingCycle || 'Monthly',
      autoActivation: tenant.settings?.autoActivation || false,
      emailNotifications: tenant.settings?.emailNotifications || false,
      trialPeriod: tenant.settings?.trialPeriod || false,
      employees: tenant.employees?.length || 0,
      status: tenant.status,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
      subscription: tenant.subscription?.status || 'Inactive'
    }));

    res.json(transformedTenants);
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ message: 'Failed to fetch tenants', error: error.message });
  }
};

const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      domain, 
      adminEmail,
      description,
      maxUsers,
      storage,
      status, 
      settings 
    } = req.body;

    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Update tenant
    await tenant.update({
      name,
      domain,
      adminEmail,
      description,
      maxUsers,
      storage,
      status,
      settings: {
        ...tenant.settings,
        ...settings
      }
    });

    // Get updated tenant with associations
    const updatedTenant = await Tenant.findByPk(id, {
      include: [
        {
          model: Subscription,
          as: 'subscription'
        },
        {
          model: Employee,
          as: 'employees',
          attributes: ['id']
        }
      ]
    });

    const transformedTenant = {
      id: updatedTenant.id,
      name: updatedTenant.name,
      domain: updatedTenant.domain,
      adminEmail: updatedTenant.adminEmail,
      description: updatedTenant.description,
      plan: updatedTenant.subscription?.plan || 'Basic',
      maxUsers: updatedTenant.maxUsers,
      storage: updatedTenant.storage,
      billingCycle: updatedTenant.subscription?.billingCycle || 'Monthly',
      autoActivation: updatedTenant.settings?.autoActivation || false,
      emailNotifications: updatedTenant.settings?.emailNotifications || false,
      trialPeriod: updatedTenant.settings?.trialPeriod || false,
      employees: updatedTenant.employees?.length || 0,
      status: updatedTenant.status,
      createdAt: updatedTenant.createdAt,
      updatedAt: updatedTenant.updatedAt
    };

    res.json(transformedTenant);
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({ message: 'Failed to update tenant', error: error.message });
  }
};

module.exports = {
  createTenant,
  getTenants,
  updateTenant
};
