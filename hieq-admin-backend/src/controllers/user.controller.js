const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const path = require('path');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendEmailVerificationEmail } = require('../utils/email');

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
    const uploadDir = path.join(__dirname, '../../uploads');
    const aadharFile = req.files?.aadhar?.[0]?.path || null;
    const profileImageFile = req.files?.profileImage?.[0]?.path || null;
    
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
          degreeFile: degreeFile ? path.relative(uploadDir, degreeFile).replace(/\\/g, '/') : null,
          status: edu.status || 'Pending'
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
      aadharFile: aadharFile ? path.relative(uploadDir, aadharFile).replace(/\\/g, '/') : null,
      profileImage: profileImageFile ? path.relative(uploadDir, profileImageFile).replace(/\\/g, '/') : null,
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
      aadharStatus,
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
    if (aadharStatus !== undefined) user.aadharStatus = aadharStatus;

    // Update password if provided
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    // Handle file uploads
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Handle multiple aadhar files - keep the latest one or append if multiple
    if (req.files?.aadhar && req.files.aadhar.length > 0) {
      // If multiple files, use the last one (or you can store all paths in an array)
      const aadharFile = req.files.aadhar[req.files.aadhar.length - 1];
      user.aadharFile = path.relative(uploadDir, aadharFile.path).replace(/\\/g, '/');
    }
    
    if (req.files?.profileImage?.[0]) {
      user.profileImage = path.relative(uploadDir, req.files.profileImage[0].path).replace(/\\/g, '/');
    }

    // Handle education - support multiple files
    const degreeFiles = req.files?.degreeFile || [];
    
    if (education !== undefined) {
      const educationData = [];
      if (Array.isArray(education)) {
        let fileIndex = 0;
        
        education.forEach((edu, index) => {
          let degreeFile = null;
          
          // If new file uploaded for this education entry
          if (fileIndex < degreeFiles.length) {
            degreeFile = path.relative(uploadDir, degreeFiles[fileIndex].path).replace(/\\/g, '/');
            fileIndex++;
          } else if (edu.degreeFile) {
            // Keep existing path if no new file uploaded
            degreeFile = edu.degreeFile;
          }
          
          educationData.push({
            degree: edu.degree || '',
            university: edu.university || '',
            year: edu.year || '',
            degreeFile: degreeFile,
            status: edu.status || 'Pending' // Preserve or set default status
          });
        });
      }
      user.education = educationData;
    } else if (degreeFiles.length > 0) {
      // If education data not provided but files are uploaded, add new education entries
      const newEducationEntries = degreeFiles.map((file) => ({
        degree: '',
        university: '',
        year: '',
        degreeFile: path.relative(uploadDir, file.path).replace(/\\/g, '/'),
        status: 'Pending'
      }));
      
      // Append to existing education or create new array
      if (user.education && Array.isArray(user.education)) {
        user.education = [...user.education, ...newEducationEntries];
      } else {
        user.education = newEducationEntries;
      }
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

        // Parse date
        let dobDate = null;
        if (dob) {
          dobDate = new Date(dob);
          if (isNaN(dobDate.getTime())) {
            dobDate = null;
          }
        }

        // Create user object
        const newUserData = {
          email,
          passwordHash,
          name: fullName,
          phone: contact || '',
          contact: contact || '',
          gender: gender || '',
          dob: dobDate,
          summary: summary || '',
          role: role || 'STUDENT',
        };

        // Add role-specific data
        if (role === 'STUDENT' || role === 'JOB_SEEKER') {
          newUserData.education = Array.isArray(education) ? education : [];
          newUserData.experience = Array.isArray(experience) ? experience : [];
        } else if (role === 'EMPLOYER') {
          newUserData.skills = Array.isArray(skills) ? skills : [];
          newUserData.companyExperience = Array.isArray(companyExperience) ? companyExperience : [];
        }

        // Create user
        const user = new User(newUserData);

        await user.save();

        results.success.push({
          email,
          name: fullName,
          id: user._id,
        });
      } catch (err) {
        console.error(`Error creating user ${userData.email}:`, err);
        let errorMessage = err.message || 'Unknown error';
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
          const validationErrors = Object.values(err.errors).map(e => e.message).join(', ');
          errorMessage = `Validation error: ${validationErrors}`;
        }
        
        // Handle duplicate key error
        if (err.code === 11000) {
          errorMessage = 'Email already exists';
        }

        results.failed.push({
          email: userData.email || 'N/A',
          reason: errorMessage,
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

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    user.updatedAt = new Date();
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// SEND PASSWORD RESET EMAIL
exports.sendPasswordResetEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Create reset URL (adjust frontend URL as needed)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&userId=${user._id}`;

    // Send email
    try {
      await sendPasswordResetEmail(user.email, resetToken, resetUrl);
      res.json({ message: 'Password reset email sent successfully' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      res.status(500).json({ message: 'Failed to send email. Please try again later.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// SEND EMAIL VERIFICATION LINK
exports.sendEmailVerificationLink = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 86400000); // 24 hours

    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save();

    // Create verification URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}&userId=${user._id}`;

    // Send email
    try {
      await sendEmailVerificationEmail(user.email, verificationToken, verificationUrl);
      res.json({ message: 'Verification email sent successfully' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      res.status(500).json({ message: 'Failed to send email. Please try again later.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    if (user.emailVerificationTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    // Verify email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    user.updatedAt = new Date();
    await user.save();

    res.json({ message: 'Email verified successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE DOCUMENT STATUS
exports.updateDocumentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType, status, educationIndex } = req.body;

    if (!documentType || !status) {
      return res.status(400).json({ message: 'Document type and status are required' });
    }

    const allowedStatuses = ['Pending', 'Approve', 'Reject'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Pending, Approve, or Reject' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (documentType === 'aadhar') {
      user.aadharStatus = status;
    } else if (documentType === 'education') {
      if (educationIndex === undefined || educationIndex === null) {
        return res.status(400).json({ message: 'Education index is required for education status update' });
      }
      if (!user.education || !user.education[educationIndex]) {
        return res.status(404).json({ message: 'Education entry not found' });
      }
      user.education[educationIndex].status = status;
    } else {
      return res.status(400).json({ message: 'Invalid document type. Must be aadhar or education' });
    }

    user.updatedAt = new Date();
    await user.save();

    res.json({ message: 'Document status updated successfully', user });
  } catch (err) {
    console.error('Update document status error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};