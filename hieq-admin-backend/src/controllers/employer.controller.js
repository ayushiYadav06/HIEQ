const Employer = require('../models/Employer');
const bcrypt = require('bcrypt');
const path = require('path');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendEmailVerificationEmail } = require('../utils/email');
const { migrateUser } = require('../utils/userMigration');

// GET /api/employers
exports.getAllEmployers = async (req, res) => {
  try {
    const { 
      search, 
      filterBy,
      verificationStatus,
      accountStatus,
      dateFrom,
      dateTo,
      page = 1, 
      limit = 10 
    } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 10));
    const filter = {};

    // Search filter
    if (search && filterBy) {
      if (filterBy === "Name") {
        filter.name = new RegExp(search, 'i');
      } else if (filterBy === "Email ID") {
        filter.email = new RegExp(search, 'i');
      } else {
        filter.$or = [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ];
      }
    } else if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    // Verification Status filter
    if (verificationStatus) {
      if (verificationStatus === "Active") {
        filter.blocked = { $ne: true };
      } else if (verificationStatus === "Blocked") {
        filter.blocked = true;
      }
    }

    // Account Status filter
    if (accountStatus) {
      if (accountStatus === "Active") {
        filter.deleted = { $ne: true };
        filter.blocked = { $ne: true };
      } else if (accountStatus === "Deleted") {
        filter.deleted = true;
      } else if (accountStatus === "Blocked") {
        filter.blocked = true;
        filter.deleted = { $ne: true };
      }
    }

    // Date filter
    if (dateFrom && dateTo) {
      const startOfDay = new Date(dateFrom);
      const endOfDay = new Date(dateTo);
      if (!isNaN(startOfDay.getTime()) && !isNaN(endOfDay.getTime())) {
        filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
      }
    } else if (dateFrom) {
      const startOfDay = new Date(dateFrom);
      if (!isNaN(startOfDay.getTime())) {
        filter.createdAt = { $gte: startOfDay };
      }
    } else if (dateTo) {
      const endOfDay = new Date(dateTo);
      if (!isNaN(endOfDay.getTime())) {
        filter.createdAt = { $lte: endOfDay };
      }
    }

    const skip = (pageNum - 1) * limitNum;
    const total = await Employer.countDocuments(filter);
    const employers = await Employer.find(filter)
      .select('-passwordHash -refreshTokens')
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limitNum));

    res.json({
      users: employers, // Keep 'users' for frontend compatibility
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    console.error('getAllEmployers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/employers/:id
exports.getEmployerById = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id)
      .select('-passwordHash -refreshTokens');
    if (!employer) return res.status(404).json({ message: 'Employer not found' });
    res.json(employer);
  } catch (err) {
    console.error('getEmployerById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE EMPLOYER
exports.createEmployer = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      phone,
      contact,
      gender,
      dob,
      summary,
      skills,
      companyExperience
    } = req.body;

    // Parse JSON strings from FormData
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

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if employer already exists
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ message: 'Employer with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Handle file uploads
    const uploadDir = path.join(__dirname, '../../uploads');
    const aadharFile = req.files?.aadhar?.[0]?.path || null;
    const profileImageFile = req.files?.profileImage?.[0]?.path || null;

    // Create employer
    const employer = new Employer({
      name,
      email,
      passwordHash,
      phone: phone || contact,
      contact,
      gender,
      dob: dob ? new Date(dob) : null,
      summary,
      aadharFile: aadharFile ? path.relative(uploadDir, aadharFile).replace(/\\/g, '/') : null,
      profileImage: profileImageFile ? path.relative(uploadDir, profileImageFile).replace(/\\/g, '/') : null,
      skills: skills || [],
      companyExperience: companyExperience || [],
      emailVerified: false,
      emailVerificationStatus: 'Pending'
    });

    await employer.save();

    const employerResponse = employer.toObject();
    delete employerResponse.passwordHash;
    delete employerResponse.refreshTokens;

    res.status(201).json({ message: 'Employer created successfully', user: employerResponse });
  } catch (err) {
    console.error('Create employer error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE EMPLOYER
exports.updateEmployer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      contact,
      gender,
      dob,
      summary,
      aadharStatus,
      skills,
      companyExperience,
      role
    } = req.body;

    // Check if role is changing - if so, migrate user
    if (role) {
      const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN', 'VERIFICATION_ADMIN', 'SUPPORT_ADMIN'];
      const needsMigration = role !== 'EMPLOYER' && role !== 'EMPLOYEE' && (role === 'CANDIDATE' || role === 'STUDENT' || role === 'JOB_SEEKER' || adminRoles.includes(role));
      
      if (needsMigration) {
        const result = await migrateUser(
          req.params.id,
          'employer',
          role,
          { name, email, password, phone, contact, gender, dob, summary, aadharStatus, skills, companyExperience, permissions: [] },
          req.files
        );
        
        if (result.migrated) {
          return res.json({ 
            message: 'Employer updated and migrated successfully', 
            user: result.user,
            migrated: true,
            newId: result.newId
          });
        }
      }
    }

    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // Update fields
    if (name) employer.name = name;
    if (email) employer.email = email;
    if (phone || contact) {
      employer.phone = phone || contact;
      employer.contact = contact || phone;
    }
    if (gender !== undefined) employer.gender = gender;
    if (dob) employer.dob = new Date(dob);
    if (summary !== undefined) employer.summary = summary;
    if (aadharStatus) employer.aadharStatus = aadharStatus;

    // Update password if provided
    if (password) {
      employer.passwordHash = await bcrypt.hash(password, 10);
    }

    // Handle file uploads
    const uploadDir = path.join(__dirname, '../../uploads');
    if (req.files?.aadhar?.[0]?.path) {
      employer.aadharFile = path.relative(uploadDir, req.files.aadhar[0].path).replace(/\\/g, '/');
    }
    if (req.files?.profileImage?.[0]?.path) {
      employer.profileImage = path.relative(uploadDir, req.files.profileImage[0].path).replace(/\\/g, '/');
    }

    // Handle skills
    if (skills !== undefined) {
      employer.skills = Array.isArray(skills) ? skills : [];
    }

    // Handle company experience
    if (companyExperience !== undefined) {
      employer.companyExperience = Array.isArray(companyExperience) ? companyExperience : [];
    }

    employer.updatedAt = new Date();
    await employer.save();

    const employerResponse = employer.toObject();
    delete employerResponse.passwordHash;
    delete employerResponse.refreshTokens;

    res.json({ message: 'Employer updated successfully', user: employerResponse });
  } catch (err) {
    console.error('Update employer error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// BULK CREATE EMPLOYERS
exports.bulkCreateEmployers = async (req, res) => {
  try {
    console.log('[bulkCreateEmployers] Request received:', { 
      method: req.method, 
      path: req.path,
      bodyKeys: Object.keys(req.body || {}),
      usersCount: req.body?.users?.length 
    });
    const { users } = req.body;
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: 'Users array is required' });
    }

    const SALT_ROUNDS = 10;
    const results = { success: [], failed: [] };

    for (const userData of users) {
      try {
        const { fullName, email, password, contact, gender, dob, summary, skills, companyExperience } = userData;

        if (!email || !password || !fullName) {
          results.failed.push({
            email: email || 'N/A',
            reason: 'Missing required fields (email, password, or fullName)',
          });
          continue;
        }

        const existing = await Employer.findOne({ email });
        if (existing) {
          results.failed.push({ email, reason: 'Email already registered' });
          continue;
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        let dobDate = null;
        if (dob) {
          dobDate = new Date(dob);
          if (isNaN(dobDate.getTime())) dobDate = null;
        }

        const newEmployerData = {
          email,
          passwordHash,
          name: fullName,
          phone: contact || '',
          contact: contact || '',
          gender: gender || '',
          dob: dobDate,
          summary: summary || '',
          emailVerified: false,
          emailVerificationStatus: 'Pending',
          skills: Array.isArray(skills) ? skills : [],
          companyExperience: Array.isArray(companyExperience) ? companyExperience : []
        };

        const employer = new Employer(newEmployerData);
        await employer.save();

        results.success.push({ email, name: fullName, id: employer._id });
      } catch (err) {
        console.error(`Error creating employer ${userData.email}:`, err);
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

// Other methods
exports.blockEmployer = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) return res.status(404).json({ message: 'Employer not found' });
    employer.blocked = true;
    await employer.save();
    res.json({ message: 'Employer blocked successfully' });
  } catch (err) {
    console.error('Block employer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unblockEmployer = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) return res.status(404).json({ message: 'Employer not found' });
    employer.blocked = false;
    await employer.save();
    res.json({ message: 'Employer unblocked successfully' });
  } catch (err) {
    console.error('Unblock employer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.softDeleteEmployer = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) return res.status(404).json({ message: 'Employer not found' });
    employer.deleted = true;
    await employer.save();
    res.json({ message: 'Employer deleted successfully' });
  } catch (err) {
    console.error('Delete employer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendPasswordResetEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const employer = await Employer.findById(id);
    if (!employer) return res.status(404).json({ message: 'Employer not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);
    employer.passwordResetToken = resetToken;
    employer.passwordResetTokenExpiry = resetTokenExpiry;
    await employer.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&userId=${employer._id}`;

    try {
      await sendPasswordResetEmail(employer.email, resetToken, resetUrl);
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

exports.sendEmailVerificationLink = async (req, res) => {
  try {
    const { id } = req.params;
    const employer = await Employer.findById(id);
    if (!employer) return res.status(404).json({ message: 'Employer not found' });

    if (employer.emailVerificationStatus === 'Verified' || employer.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 86400000);
    employer.emailVerificationToken = verificationToken;
    employer.emailVerificationTokenExpiry = tokenExpiry;
    await employer.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}&userId=${employer._id}`;

    try {
      await sendEmailVerificationEmail(employer.email, verificationToken, verificationUrl);
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

exports.verifyEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.query.token || req.body.token;
    if (!token) return res.status(400).json({ message: 'Verification token is required' });

    const employer = await Employer.findById(id);
    if (!employer) return res.status(404).json({ message: 'Employer not found' });

    if (employer.emailVerificationStatus === 'Verified' || employer.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    if (!employer.emailVerificationToken || employer.emailVerificationToken !== token) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    if (employer.emailVerificationTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    employer.emailVerified = true;
    employer.emailVerificationStatus = 'Verified';
    employer.emailVerificationToken = undefined;
    employer.emailVerificationTokenExpiry = undefined;
    employer.updatedAt = new Date();
    await employer.save();

    res.json({ 
      message: 'Email verified successfully', 
      user: {
        _id: employer._id,
        email: employer.email,
        emailVerified: employer.emailVerified,
        emailVerificationStatus: employer.emailVerificationStatus
      }
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

    const employer = await Employer.findById(id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    employer.passwordHash = passwordHash;
    employer.updatedAt = new Date();
    await employer.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE DOCUMENT STATUS
exports.updateDocumentStatus = async (req, res) => {
  try {
    console.log('[updateDocumentStatus] Request received:', { 
      method: req.method, 
      path: req.path,
      id: req.params.id,
      body: req.body
    });
    const { id } = req.params;
    const { documentType, status, educationIndex } = req.body;

    if (!documentType || !status) {
      return res.status(400).json({ message: 'Document type and status are required' });
    }

    const allowedStatuses = ['Pending', 'Approve', 'Reject'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Pending, Approve, or Reject' });
    }

    const employer = await Employer.findById(id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // Employers have aadharStatus but not education documents
    if (documentType === 'aadhar') {
      employer.aadharStatus = status;
    } else if (documentType === 'education') {
      // Employers don't have education documents
      return res.status(400).json({ message: 'Education document type is not supported for employers' });
    } else {
      return res.status(400).json({ message: 'Invalid document type. Must be aadhar' });
    }

    employer.updatedAt = new Date();
    await employer.save();

    const employerResponse = employer.toObject();
    delete employerResponse.passwordHash;
    delete employerResponse.refreshTokens;

    res.json({ message: 'Document status updated successfully', user: employerResponse });
  } catch (err) {
    console.error('Update document status error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

