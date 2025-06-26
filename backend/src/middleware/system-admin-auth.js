const systemAdminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ message: 'Access denied. System admin rights required.' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = systemAdminAuth;