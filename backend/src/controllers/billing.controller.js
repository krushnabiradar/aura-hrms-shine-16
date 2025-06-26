const { Subscription, Tenant } = require('../models');

const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [{
        model: Tenant,
        attributes: ['name', 'domain']
      }],
      order: [['startDate', 'DESC']]
    });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscriptions', error: error.message });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, status, startDate, endDate, billingCycle } = req.body;

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    await subscription.update({
      plan,
      status,
      startDate,
      endDate,
      billingCycle
    });

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update subscription', error: error.message });
  }
};

module.exports = {
  getSubscriptions,
  updateSubscription
};