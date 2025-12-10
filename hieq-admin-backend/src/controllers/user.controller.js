const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

// BULK CREATE USERS FROM CSV
exports.bulkCreateUsers = async (req, res) => {
  try {
    const { users } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: 'Users array is required' });
    }

    const SALT_ROUNDS = 10;
    const results = {
      success: [],
      failed: [],
    };

    for (const userData of users) {
      try {
        const {
          fullName,
          email,
          password,
          contact,
          gender,
          dob,
          summary,
          role,
          // Candidate fields
          education,
          experience,
          // Employer fields
          skills,
          companyExperience,
        } = userData;

        // Validate required fields
        if (!email || !password || !fullName) {
          results.failed.push({
            email: email || 'N/A',
            reason: 'Missing required fields (email, password, or fullName)',
          });
          continue;
        }

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
          results.failed.push({
            email,
            reason: 'Email already registered',
          });
          continue;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Build profile object
        const profile = {
          contact: contact || '',
          gender: gender || '',
          dob: dob || '',
          summary: summary || '',
        };

        // Add role-specific data
        if (role === 'STUDENT' || role === 'EMPLOYER') {
          if (role === 'STUDENT') {
            profile.education = education || [];
            profile.experience = experience || [];
          } else if (role === 'EMPLOYER') {
            profile.skills = skills || [];
            profile.companyExperience = companyExperience || [];
          }
        }

        // Create user
        const user = new User({
          email,
          passwordHash,
          name: fullName,
          phone: contact || '',
          role: role || 'STUDENT',
          profile,
        });

        await user.save();

        results.success.push({
          email,
          name: fullName,
          id: user._id,
        });
      } catch (err) {
        console.error(`Error creating user ${userData.email}:`, err);
        results.failed.push({
          email: userData.email || 'N/A',
          reason: err.message || 'Unknown error',
        });
      }
    }

    res.json({
      message: `Bulk upload completed. ${results.success.length} succeeded, ${results.failed.length} failed.`,
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};