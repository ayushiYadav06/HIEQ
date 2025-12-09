const User = require('../models/User');

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search)
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];

    const users = await User.find(filter)
      .select('-passwordHash -refreshTokens')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash -refreshTokens');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role)
      return res.status(400).json({ message: 'Role required' });

    const allowedRoles = [
      'SUPER_ADMIN',
      'ADMIN',
      'CONTENT_ADMIN',
      'VERIFICATION_ADMIN',
      'SUPPORT_ADMIN',
      'EMPLOYER',
      'STUDENT'
    ];

    if (!allowedRoles.includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash -refreshTokens');

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Role updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// BLOCK USER
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { blocked: true },
      { new: true }
    ).select('-passwordHash -refreshTokens');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User blocked', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UNBLOCK USER
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { blocked: false },
      { new: true }
    ).select('-passwordHash -refreshTokens');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User unblocked', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// SOFT DELETE USER
exports.softDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    ).select('-passwordHash -refreshTokens');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted (soft)', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
