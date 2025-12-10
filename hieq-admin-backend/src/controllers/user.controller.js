const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Role = require('../models/Role');
const path = require('path');

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
      'STUDENT',
      'JOB_SEEKER'
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

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      role,
      permissions,
      phone,
      contact,
      gender,
      dob,
      summary,
      education,
      experience,
      skills,
      companyExperience
    } = req.body;

    // Parse JSON strings from FormData
    if (typeof experience === 'string') {
      try {
        experience = JSON.parse(experience);
      } catch (e) {
        experience = [];
      }
    }
    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
      } catch (e) {
        skills = [];
      }
    }
    if (typeof companyExperience === 'string') {
      try {
        companyExperience = JSON.parse(companyExperience);
      } catch (e) {
        companyExperience = [];
      }
    }

    // Handle education array from FormData
    if (!Array.isArray(education)) {
      education = [];
      // Parse education from FormData format
      const educationKeys = Object.keys(req.body).filter(key => key.startsWith('education['));
      if (educationKeys.length > 0) {
        const educationMap = {};
        educationKeys.forEach(key => {
          const match = key.match(/education\[(\d+)\]\[(\w+)\]/);
          if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            if (!educationMap[index]) educationMap[index] = {};
            educationMap[index][field] = req.body[key];
          }
        });
        education = Object.values(educationMap);
      }
    }

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Get role permissions if not provided
    let userPermissions = permissions || [];
    if (!permissions || permissions.length === 0) {
      const roleDoc = await Role.findOne({ name: role });
      if (roleDoc && roleDoc.permissions) {
        userPermissions = roleDoc.permissions;
      }
    }

    // Handle file uploads
    const aadharFile = req.files?.aadhar?.[0]?.path || null;
    
    // Handle education files
    const educationData = [];
    if (education && Array.isArray(education) && education.length > 0) {
      const degreeFiles = req.files?.degreeFile || [];
      let fileIndex = 0;
      
      education.forEach((edu, index) => {
        let degreeFile = null;
        // Match files with education entries (files are uploaded in order)
        if (edu.degreeFile !== undefined && edu.degreeFile !== null && edu.degreeFile !== '') {
          // If degreeFile is already a path (from update), keep it
          if (typeof edu.degreeFile === 'string' && !edu.degreeFile.includes('\\') && !edu.degreeFile.includes('/')) {
            degreeFile = null; // Invalid path, will be set from uploaded file
          } else if (typeof edu.degreeFile === 'string') {
            degreeFile = edu.degreeFile; // Keep existing path
          }
        }
        
        // If no existing file and we have uploaded files, use the next one
        if (!degreeFile && fileIndex < degreeFiles.length) {
          degreeFile = degreeFiles[fileIndex].path;
          fileIndex++;
        }
        
        educationData.push({
          degree: edu.degree || '',
          university: edu.university || '',
          year: edu.year || '',
          degreeFile: degreeFile ? path.relative(path.join(__dirname, '../../'), degreeFile) : null
        });
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      passwordHash,
      role,
      permissions: userPermissions,
      phone: phone || contact,
      contact,
      gender,
      dob: dob ? new Date(dob) : null,
      summary,
      aadharFile: aadharFile ? path.relative(path.join(__dirname, '../../'), aadharFile) : null,
      education: educationData,
      experience: experience || [],
      skills: skills || [],
      companyExperience: companyExperience || []
    });

    await user.save();

    // Return user without sensitive data
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    delete userResponse.refreshTokens;

    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      permissions,
      phone,
      contact,
      gender,
      dob,
      summary,
      education,
      experience,
      skills,
      companyExperience
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (contact !== undefined) user.contact = contact;
    if (gender !== undefined) user.gender = gender;
    if (dob !== undefined) user.dob = dob ? new Date(dob) : null;
    if (summary !== undefined) user.summary = summary;
    if (role !== undefined) user.role = role;
    if (permissions !== undefined) user.permissions = permissions;

    // Update password if provided
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    // Handle file uploads
    if (req.files?.aadhar?.[0]) {
      user.aadharFile = path.relative(path.join(__dirname, '../../'), req.files.aadhar[0].path);
    }

    // Handle education
    if (education !== undefined) {
      const educationData = [];
      if (Array.isArray(education)) {
        education.forEach((edu, index) => {
          const degreeFile = req.files?.degreeFile?.[index]?.path 
            ? path.relative(path.join(__dirname, '../../'), req.files.degreeFile[index].path)
            : (edu.degreeFile || null);
          educationData.push({
            degree: edu.degree || '',
            university: edu.university || '',
            year: edu.year || '',
            degreeFile: degreeFile
          });
        });
      }
      user.education = educationData;
    }

    // Update other arrays
    if (experience !== undefined) user.experience = experience;
    if (skills !== undefined) user.skills = skills;
    if (companyExperience !== undefined) user.companyExperience = companyExperience;

    user.updatedAt = Date.now();
    await user.save();

    // Return user without sensitive data
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    delete userResponse.refreshTokens;

    res.json({ message: 'User updated successfully', user: userResponse });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE USER (hard delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
