
const { User, Tenant, Employee } = require('../models');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, tenantId, status = 'Active' } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Name, email, password, and role are required' 
      });
    }

    // Validate role
    const validRoles = ['system_admin', 'tenant_admin', 'employee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role. Must be one of: ' + validRoles.join(', ') 
      });
    }

    // Check if tenant exists for non-system admin roles
    if (role !== 'system_admin') {
      if (!tenantId) {
        return res.status(400).json({ 
          message: 'Tenant ID is required for non-system admin users' 
        });
      }
      
      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ message: 'Tenant not found' });
      }
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      tenantId: role === 'system_admin' ? null : tenantId,
      status
    });

    // Return user without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      message: 'Failed to create user', 
      error: error.message 
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { tenantId, role } = req.query;
    
    const whereClause = {};
    if (tenantId) whereClause.tenantId = tenantId;
    if (role) whereClause.role = role;

    const users = await User.findAll({
      where: whereClause,
      include: [{
        model: Tenant,
        as: 'tenant',
        attributes: ['id', 'name', 'domain'],
        required: false
      }],
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    // Transform data to include tenant information
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      tenantId: user.tenantId,
      tenantName: user.tenant?.name || null,
      tenantDomain: user.tenant?.domain || null,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.json(transformedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users', 
      error: error.message 
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, tenantId } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['system_admin', 'tenant_admin', 'employee'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ 
          message: 'Invalid role. Must be one of: ' + validRoles.join(', ') 
        });
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['Active', 'Inactive'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status. Must be Active or Inactive' 
        });
      }
    }

    // Check if tenant exists for non-system admin roles
    if (role && role !== 'system_admin' && tenantId) {
      const tenant = await Tenant.findByPk(tenantId);
      if (!tenant) {
        return res.status(404).json({ message: 'Tenant not found' });
      }
    }

    // Check if email is unique (excluding current user)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { email },
        attributes: ['id']
      });
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    await user.update({
      name,
      email,
      role,
      status,
      tenantId: role === 'system_admin' ? null : tenantId
    });

    // Return updated user with tenant info
    const updatedUser = await User.findByPk(id, {
      include: [{
        model: Tenant,
        as: 'tenant',
        attributes: ['id', 'name', 'domain'],
        required: false
      }],
      attributes: { exclude: ['password'] }
    });

    const userResponse = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      tenantId: updatedUser.tenantId,
      tenantName: updatedUser.tenant?.name || null,
      tenantDomain: updatedUser.tenant?.domain || null,
      lastLogin: updatedUser.lastLogin,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      message: 'Failed to update user', 
      error: error.message 
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deletion of system admin users
    if (user.role === 'system_admin') {
      return res.status(403).json({ 
        message: 'Cannot delete system admin users' 
      });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      message: 'Failed to delete user', 
      error: error.message 
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser
};
