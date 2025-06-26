
const { Subscription, Tenant } = require('../models');

const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [{
        model: Tenant,
        as: 'tenant',
        attributes: ['id', 'name', 'domain', 'adminEmail', 'status']
      }],
      order: [['startDate', 'DESC']]
    });

    // Transform data to match frontend expectations
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

    res.json(transformedSubscriptions);
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch subscriptions', 
      error: error.message 
    });
  }
};

const createSubscription = async (req, res) => {
  try {
    const { tenantId, plan, billingCycle, amount, currency = 'USD' } = req.body;

    // Validate required fields
    if (!tenantId || !plan) {
      return res.status(400).json({ 
        message: 'Tenant ID and plan are required' 
      });
    }

    // Check if tenant exists
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Calculate end date based on billing cycle
    const startDate = new Date();
    const endDate = new Date();
    if (billingCycle === 'Yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const subscription = await Subscription.create({
      tenantId,
      plan,
      status: 'Active',
      startDate,
      endDate,
      billingCycle: billingCycle || 'Monthly',
      amount,
      currency
    });

    res.status(201).json(subscription);
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ 
      message: 'Failed to create subscription', 
      error: error.message 
    });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, status, startDate, endDate, billingCycle, amount, currency } = req.body;

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Validate status if provided
    const validStatuses = ['Active', 'Inactive', 'Cancelled', 'Past_Due'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      });
    }

    // Validate billing cycle if provided
    const validCycles = ['Monthly', 'Yearly'];
    if (billingCycle && !validCycles.includes(billingCycle)) {
      return res.status(400).json({ 
        message: 'Invalid billing cycle. Must be Monthly or Yearly' 
      });
    }

    await subscription.update({
      plan,
      status,
      startDate,
      endDate,
      billingCycle,
      amount,
      currency
    });

    // Return updated subscription with tenant info
    const updatedSubscription = await Subscription.findByPk(id, {
      include: [{
        model: Tenant,
        as: 'tenant',
        attributes: ['id', 'name', 'domain']
      }]
    });

    res.json(updatedSubscription);
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ 
      message: 'Failed to update subscription', 
      error: error.message 
    });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    await subscription.destroy();
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({ 
      message: 'Failed to delete subscription', 
      error: error.message 
    });
  }
};

module.exports = {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
};
