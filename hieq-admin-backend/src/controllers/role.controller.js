const Role = require('../models/Role');
const Permission = require('../models/Permission');

// GET all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true }).sort({ name: 1 });
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE new role
exports.createRole = async (req, res) => {
  try {
    const { name, displayName, description, permissions } = req.body;

    if (!name || !displayName) {
      return res.status(400).json({ message: 'Name and display name are required' });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role with this name already exists' });
    }

    const role = new Role({
      name,
      displayName,
      description,
      permissions: permissions || []
    });

    await role.save();
    res.status(201).json(role);
  } catch (err) {
    console.error('Create role error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Role with this name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE role
exports.updateRole = async (req, res) => {
  try {
    const { displayName, description, permissions, isActive } = req.body;

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    if (displayName !== undefined) role.displayName = displayName;
    if (description !== undefined) role.description = description;
    if (permissions !== undefined) role.permissions = permissions;
    if (isActive !== undefined) role.isActive = isActive;
    role.updatedAt = Date.now();

    await role.save();
    res.json(role);
  } catch (err) {
    console.error('Update role error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE role (soft delete)
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json(permissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE permission
exports.createPermission = async (req, res) => {
  try {
    const { name, displayName, description, category } = req.body;

    if (!name || !displayName) {
      return res.status(400).json({ message: 'Name and display name are required' });
    }

    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
      return res.status(400).json({ message: 'Permission with this name already exists' });
    }

    const permission = new Permission({
      name,
      displayName,
      description,
      category: category || 'general'
    });

    await permission.save();
    res.status(201).json(permission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE permission
exports.updatePermission = async (req, res) => {
  try {
    const { displayName, description, category, isActive } = req.body;

    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    if (displayName !== undefined) permission.displayName = displayName;
    if (description !== undefined) permission.description = description;
    if (category !== undefined) permission.category = category;
    if (isActive !== undefined) permission.isActive = isActive;
    permission.updatedAt = Date.now();

    await permission.save();
    res.json(permission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE permission (soft delete)
exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    res.json({ message: 'Permission deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

