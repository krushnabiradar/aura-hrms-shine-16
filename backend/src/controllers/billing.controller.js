
const { Subscription, Tenant } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Validation helper functions
const validateSubscriptionData = (data) => {
  const errors = [];
  
  if (!data.tenantId) {
    errors.push('Tenant ID is required');
  }
  
  if (!data.plan || !['Basic', 'Business', 'Enterprise'].includes(data.plan)) {
    errors.push('Invalid plan selected');
  }
  
  if (!data.billingCycle || !['Monthly', 'Yearly'].includes(data.billingCycle)) {
    errors.push('Invalid billing cycle selected');
  }
  
  if (!data.amount || data.amount < 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (data.currency && !['USD', 'EUR', 'GBP'].includes(data.currency)) {
    errors.push('Invalid currency');
  }
  
  return errors;
};

const calculateAmount = (plan, billingCycle) => {
  const pricing = {
    Basic: { Monthly: 29, Yearly: 290 },
    Business: { Monthly: 79, Yearly: 790 },
    Enterprise: { Monthly: 199, Yearly: 1990 }
  };
  
  return pricing[plan]?.[billingCycle] || 0;
};

const getSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, plan } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (plan) whereClause.plan = plan;

    const tenantWhereClause = {};
    if (search) {
      tenantWhereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { domain: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: subscriptions } = await Subscription.findAndCountAll({
      where: whereClause,
      include: [{
        model: Tenant,
        as: 'tenant',
        attributes: ['id', 'name', 'domain'],
        where: Object.keys(tenantWhereClause).length > 0 ? tenantWhereClause : undefined,
        required: true
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const transformedSubscriptions = subscriptions.map(sub => ({
      id: sub.id,
      tenantId: sub.tenantId,
      tenantName: sub.tenant?.name || 'Unknown',
      tenantDomain: sub.tenant?.domain || 'Unknown',
      plan: sub.plan,
      status: sub.status,
      startDate: sub.startDate,
      endDate: sub.endDate,
      billingCycle: sub.billingCycle,
      amount: sub.amount,
      currency: sub.currency,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt
    }));

    res.json({
      subscriptions: transformedSubscriptions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch subscriptions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const createSubscription = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, plan, billingCycle, amount, currency = 'USD' } = req.body;

    // Validate input data
    const errors = validateSubscriptionData({ tenantId, plan, billingCycle, amount, currency });
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors
      });
    }

    // Check if tenant exists
    const tenant = await Tenant.findByPk(tenantId, { transaction });
    if (!tenant) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Check if tenant already has an active subscription
    const existingSubscription = await Subscription.findOne({
      where: { 
        tenantId,
        status: { [Op.in]: ['Active', 'Past_Due'] }
      },
      transaction
    });

    if (existingSubscription) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Tenant already has an active subscription',
        existingSubscription: {
          id: existingSubscription.id,
          plan: existingSubscription.plan,
          status: existingSubscription.status
        }
      });
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    
    if (billingCycle === 'Monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Validate amount matches plan pricing
    const expectedAmount = calculateAmount(plan, billingCycle);
    if (amount !== expectedAmount) {
      console.warn(`Amount mismatch for ${plan} ${billingCycle}: expected ${expectedAmount}, got ${amount}`);
    }

    const subscription = await Subscription.create({
      tenantId,
      plan,
      status: 'Active',
      startDate,
      endDate,
      billingCycle,
      amount,
      currency
    }, { transaction });

    await transaction.commit();

    // Get subscription with tenant data
    const createdSubscription = await Subscription.findByPk(subscription.id, {
      include: [{
        model: Tenant,
        as: 'tenant',
        attributes: ['id', 'name', 'domain']
      }]
    });

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: {
        id: createdSubscription.id,
        tenantId: createdSubscription.tenantId,
        tenantName: createdSubscription.tenant?.name || 'Unknown',
        tenantDomain: createdSubscription.tenant?.domain || 'Unknown',
        plan: createdSubscription.plan,
        status: createdSubscription.status,
        startDate: createdSubscription.startDate,
        endDate: createdSubscription.endDate,
        billingCycle: createdSubscription.billingCycle,
        amount: createdSubscription.amount,
        currency: createdSubscription.currency,
        createdAt: createdSubscription.createdAt,
        updatedAt: createdSubscription.updatedAt
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create subscription error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: error.errors.map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updateSubscription = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { plan, status, billingCycle, amount, currency } = req.body;

    const subscription = await Subscription.findByPk(id, { transaction });
    if (!subscription) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Validation
    const errors = [];
    
    if (plan && !['Basic', 'Business', 'Enterprise'].includes(plan)) {
      errors.push('Invalid plan selected');
    }
    
    if (status && !['Active', 'Inactive', 'Cancelled', 'Past_Due'].includes(status)) {
      errors.push('Invalid status');
    }
    
    if (billingCycle && !['Monthly', 'Yearly'].includes(billingCycle)) {
      errors.push('Invalid billing cycle');
    }
    
    if (amount !== undefined && amount < 0) {
      errors.push('Amount must be greater than or equal to 0');
    }
    
    if (currency && !['USD', 'EUR', 'GBP'].includes(currency)) {
      errors.push('Invalid currency');
    }

    if (errors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Validation failed',
        errors
      });
    }

    // Update subscription
    const updateData = {};
    if (plan) updateData.plan = plan;
    if (status) updateData.status = status;
    if (billingCycle) updateData.billingCycle = billingCycle;
    if (amount !== undefined) updateData.amount = amount;
    if (currency) updateData.currency = currency;

    // If plan or billing cycle changed, recalculate end date and amount
    if (plan || billingCycle) {
      const newPlan = plan || subscription.plan;
      const newBillingCycle = billingCycle || subscription.billingCycle;
      
      if (!amount) {
        updateData.amount = calculateAmount(newPlan, newBillingCycle);
      }
      
      // Update end date based on current date
      const newEndDate = new Date();
      if (newBillingCycle === 'Monthly') {
        newEndDate.setMonth(newEndDate.getMonth() + 1);
      } else {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      }
      updateData.endDate = newEndDate;
    }

    await subscription.update(updateData, { transaction });

    await transaction.commit();

    // Get updated subscription with tenant data
    const updatedSubscription = await Subscription.findByPk(id, {
      include: [{
        model: Tenant,
        as: 'tenant',
        attributes: ['id', 'name', 'domain']
      }]
    });

    res.json({
      message: 'Subscription updated successfully',
      subscription: {
        id: updatedSubscription.id,
        tenantId: updatedSubscription.tenantId,
        tenantName: updatedSubscription.tenant?.name || 'Unknown',
        tenantDomain: updatedSubscription.tenant?.domain || 'Unknown',
        plan: updatedSubscription.plan,
        status: updatedSubscription.status,
        startDate: updatedSubscription.startDate,
        endDate: updatedSubscription.endDate,
        billingCycle: updatedSubscription.billingCycle,
        amount: updatedSubscription.amount,
        currency: updatedSubscription.currency,
        createdAt: updatedSubscription.createdAt,
        updatedAt: updatedSubscription.updatedAt
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update subscription error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: error.errors.map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to update subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const deleteSubscription = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByPk(id, {
      include: [{
        model: Tenant,
        as: 'tenant',
        attributes: ['id', 'name', 'domain']
      }],
      transaction
    });

    if (!subscription) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Store subscription data before deletion
    const deletedSubscriptionData = {
      id: subscription.id,
      tenantName: subscription.tenant?.name || 'Unknown',
      tenantDomain: subscription.tenant?.domain || 'Unknown',
      plan: subscription.plan,
      status: subscription.status
    };

    await subscription.destroy({ transaction });
    await transaction.commit();

    res.json({ 
      message: 'Subscription deleted successfully',
      deletedSubscription: deletedSubscriptionData
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete subscription error:', error);
    res.status(500).json({ 
      message: 'Failed to delete subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
};
