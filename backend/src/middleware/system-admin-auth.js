
const systemAdminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'NO_USER'
      });
    }

    if (req.user.role !== 'system_admin') {
      console.log(`Access denied for user ${req.user.email} with role ${req.user.role}`);
      return res.status(403).json({ 
        message: 'Access denied. System admin rights required.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    console.log(`System admin access granted for user ${req.user.email}`);
    next();
  } catch (error) {
    console.error('System admin auth error:', error);
    res.status(500).json({ 
      message: 'Authorization check failed',
      code: 'AUTH_CHECK_FAILED'
    });
  }
};

module.exports = systemAdminAuth;
