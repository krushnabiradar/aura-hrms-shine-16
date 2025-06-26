
const { Tenant, User, Subscription, Employee } = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateDomain = (domain) => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
};

const createTenant = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      name, 
      domain, 
      adminEmail, 
      adminName, 
      plan = 'Basic',
      description,
      maxUsers = 10,
      storage = '1GB',
      billingCycle = 'Monthly',
      autoActivation = true,
      emailNotifications = true,
      trialPeriod = false
    } = req.body;

    // Comprehensive validation
    const errors = [];
    
    if (!name || name.trim().length < 2) {
      errors.push('Organization name must be at least 2 characters long');
    }
    
    if (!domain || !validateDomain(domain)) {
      errors.push('Please provide a valid domain (e.g., company.com)');
    }
    
    if (!adminEmail || !validateEmail(adminEmail)) {
      errors.push('Please provide a valid admin email address');
    }
    
    if (!adminName || adminName.trim().length < 2) {
      errors.push('Admin name must be at least 2 characters long');
    }
    
    if (maxUsers < 1 || maxUsers > 10000) {
      errors.push('Max users must be between 1 and 10000');
    }
    
    if (!['Basic', 'Business', 'Enterprise'].includes(plan)) {
      errors.push('Invalid plan selected');
    }
    
    if (!['Monthly', 'Yearly'].includes(billingCycle)) {
      errors.push('Invalid billing cycle selected');
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors
      });
    }

    // Check for existing domain
    const existingTenant = await Tenant.findOne({ 
      where: { 
        domain: { [Op.iLike]: domain.toLowerCase() }
      },
      transaction
    });
    
    if (existingTenant) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Domain already exists',
        field: 'domain'
      });
    }

    // Check for existing admin email
    const existingUser = await User.findOne({ 
      where: { 
        email: { [Op.iLike]: adminEmail.toLowerCase() }
      },
      transaction
    });
    
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Admin email already registered',
        field: 'adminEmail'
      });
    }

    console.log(`Creating tenant: ${name} with domain: ${domain}`);

    // Create tenant
    const tenant = await Tenant.create({
      name: name.trim(),
      domain: domain.toLowerCase(),
      adminEmail: adminEmail.toLowerCase(),
      description: description?.trim() || null,
      maxUsers,
      storage,
      status: autoActivation ? 'Active' : 'Inactive',
      settings: {
        autoActivation,
        emailNotifications,
        trialPeriod
      }
    }, { transaction });

    console.log(`Tenant created with ID: ${tenant.id}`);

    // Generate secure temporary password
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Create tenant admin user
    const adminUser = await User.create({
      name: adminName.trim(),
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: 'tenant_admin',
      tenantId: tenant.id,
      status: 'Active'
    }, { transaction });

    console.log(`Admin user created with ID: ${adminUser.id}`);

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    
    if (trialPeriod) {
      endDate.setDate(endDate.getDate() + 30); // 30-day trial
    } else {
      if (billingCycle === 'Monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
    }

    // Determine subscription amount based on plan
    let amount = 0;
    switch (plan) {
      case 'Basic':
        amount = billingCycle === 'Monthly' ? 29 : 290;
        break;
      case 'Business':
        amount = billingCycle === 'Monthly' ? 79 : 790;
        break;
      case 'Enterprise':
        amount = billingCycle === 'Monthly' ? 199 : 1990;
        break;
    }

    // Create subscription
    const subscription = await Subscription.create({
      tenantId: tenant.id,
      plan,
      status: 'Active',
      startDate,
      endDate,
      billingCycle,
      amount,
      currency: 'USD'
    }, { transaction });

    console.log(`Subscription created with ID: ${subscription.id}`);

    // Commit transaction
    await transaction.commit();

    // Return response with all created data
    res.status(201).json({
      message: 'Tenant created successfully',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        adminEmail: tenant.adminEmail,
        description: tenant.description,
        plan: subscription.plan,
        maxUsers: tenant.maxUsers,
        storage: tenant.storage,
        billingCycle: subscription.billingCycle,
        autoActivation: tenant.settings?.autoActivation || false,
        emailNotifications: tenant.settings?.emailNotifications || false,
        trialPeriod: tenant.settings?.trialPeriod || false,
        employees: 0,
        status: tenant.status,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
        subscription: subscription.status
      },
      adminUser: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        tempPassword, // Send temp password for initial setup
        loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
      },
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        billingCycle: subscription.billingCycle,
        amount: subscription.amount,
        currency: subscription.currency
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Create tenant error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: error.errors.map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create tenant. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getTenants = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { domain: { [Op.iLike]: `%${search}%` } },
        { adminEmail: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: tenants } = await Tenant.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Subscription,
          as: 'subscription',
          attributes: ['id', 'plan', 'status', 'endDate', 'billingCycle', 'amount', 'currency']
        },
        {
          model: Employee,
          as: 'employees',
          attributes: ['id']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

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
      subscription: tenant.subscription?.status || 'Inactive',
      createdDate: new Date(tenant.createdAt).toLocaleDateString()
    }));

    res.json({
      tenants: transformedTenants,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch tenants',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updateTenant = async (req, res) => {
  const transaction = await sequelize.transaction();
  
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

    // Validation
    const errors = [];
    
    if (name && name.trim().length < 2) {
      errors.push('Organization name must be at least 2 characters long');
    }
    
    if (domain && !validateDomain(domain)) {
      errors.push('Please provide a valid domain');
    }
    
    if (adminEmail && !validateEmail(adminEmail)) {
      errors.push('Please provide a valid admin email address');
    }
    
    if (maxUsers && (maxUsers < 1 || maxUsers > 10000)) {
      errors.push('Max users must be between 1 and 10000');
    }
    
    if (status && !['Active', 'Inactive', 'Suspended'].includes(status)) {
      errors.push('Invalid status');
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors
      });
    }

    const tenant = await Tenant.findByPk(id, { transaction });
    if (!tenant) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Check for duplicate domain (excluding current tenant)
    if (domain && domain.toLowerCase() !== tenant.domain) {
      const existingTenant = await Tenant.findOne({ 
        where: { 
          domain: { [Op.iLike]: domain.toLowerCase() },
          id: { [Op.ne]: id }
        },
        transaction
      });
      
      if (existingTenant) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: 'Domain already exists',
          field: 'domain'
        });
      }
    }

    // Update tenant
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (domain) updateData.domain = domain.toLowerCase();
    if (adminEmail) updateData.adminEmail = adminEmail.toLowerCase();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (maxUsers) updateData.maxUsers = maxUsers;
    if (storage) updateData.storage = storage;
    if (status) updateData.status = status;
    if (settings) {
      updateData.settings = {
        ...tenant.settings,
        ...settings
      };
    }

    await tenant.update(updateData, { transaction });

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
      ],
      transaction
    });

    await transaction.commit();

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
      updatedAt: updatedTenant.updatedAt,
      subscription: updatedTenant.subscription?.status || 'Inactive'
    };

    res.json({
      message: 'Tenant updated successfully',
      tenant: transformedTenant
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update tenant error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: error.errors.map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to update tenant',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const deleteTenant = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    const tenant = await Tenant.findByPk(id, { transaction });
    if (!tenant) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Check if tenant has active users (besides admin)
    const userCount = await User.count({
      where: { 
        tenantId: id,
        role: { [Op.ne]: 'tenant_admin' }
      },
      transaction
    });

    if (userCount > 0) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Cannot delete tenant with active users. Please remove all users first.' 
      });
    }

    // Delete in proper order due to foreign key constraints
    await Subscription.destroy({ where: { tenantId: id }, transaction });
    await User.destroy({ where: { tenantId: id }, transaction });
    await Employee.destroy({ where: { tenantId: id }, transaction });
    await tenant.destroy({ transaction });

    await transaction.commit();

    res.json({ 
      message: 'Tenant deleted successfully',
      deletedTenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete tenant error:', error);
    res.status(500).json({ 
      message: 'Failed to delete tenant',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createTenant,
  getTenants,
  updateTenant,
  deleteTenant
};
