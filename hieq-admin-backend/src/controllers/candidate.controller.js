const Candidate = require('../models/Candidate');
const bcrypt = require('bcrypt');
const path = require('path');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendEmailVerificationEmail } = require('../utils/email');

// GET /api/candidates
exports.getAllCandidates = async (req, res) => {
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

    // Search filter - based on filterBy type
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
    const total = await Candidate.countDocuments(filter);
    const candidates = await Candidate.find(filter)
      .select('-passwordHash -refreshTokens')
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limitNum));

    res.json({
      users: candidates, // Keep 'users' for frontend compatibility
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    console.error('getAllCandidates error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/candidates/:id
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .select('-passwordHash -refreshTokens');
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    console.error('getCandidateById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE CANDIDATE
exports.createCandidate = async (req, res) => {
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
      education,
      experience
    } = req.body;

    // Parse JSON strings from FormData
    if (typeof experience === 'string') {
      try {
        experience = JSON.parse(experience);
      } catch (e) {
        experience = [];
      }
    }

    // Handle education array from FormData
    if (!Array.isArray(education)) {
      education = [];
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
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ message: 'Candidate with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Handle file uploads
    const uploadDir = path.join(__dirname, '../../uploads');
    const aadharFile = req.files?.aadhar?.[0]?.path || null;
    const profileImageFile = req.files?.profileImage?.[0]?.path || null;
    
    // Handle education files
    const educationData = [];
    if (education && Array.isArray(education) && education.length > 0) {
      const degreeFiles = req.files?.degreeFile || [];
      let fileIndex = 0;
      
      education.forEach((edu) => {
        let degreeFile = null;
        if (edu.degreeFile !== undefined && edu.degreeFile !== null && edu.degreeFile !== '') {
          if (typeof edu.degreeFile === 'string' && !edu.degreeFile.includes('\\') && !edu.degreeFile.includes('/')) {
            degreeFile = null;
          } else if (typeof edu.degreeFile === 'string') {
            degreeFile = edu.degreeFile;
          }
        }
        
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

    // Create candidate
    const candidate = new Candidate({
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
      education: educationData,
      experience: experience || [],
      emailVerified: false,
      emailVerificationStatus: 'Pending'
    });

    await candidate.save();

    const candidateResponse = candidate.toObject();
    delete candidateResponse.passwordHash;
    delete candidateResponse.refreshTokens;

    res.status(201).json({ message: 'Candidate created successfully', user: candidateResponse });
  } catch (err) {
    console.error('Create candidate error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE CANDIDATE
exports.updateCandidate = async (req, res) => {
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
      education,
      experience,
      role
    } = req.body;

    // Check if role is changing - if so, migrate user
    if (role) {
      const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN', 'VERIFICATION_ADMIN', 'SUPPORT_ADMIN'];
      const needsMigration = role === 'EMPLOYER' || role === 'EMPLOYEE' || adminRoles.includes(role);
      
      if (needsMigration) {
        const { migrateUser } = require('../utils/userMigration');
        const result = await migrateUser(
          req.params.id,
          'candidate',
          role,
          { name, email, password, phone, contact, gender, dob, summary, aadharStatus, education, experience, permissions: [] },
          req.files
        );
        
        if (result.migrated) {
          return res.json({ 
            message: 'Candidate updated and migrated successfully', 
            user: result.user,
            migrated: true,
            newId: result.newId
          });
        }
      }
    }

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Update fields
    if (name) candidate.name = name;
    if (email) candidate.email = email;
    if (phone || contact) {
      candidate.phone = phone || contact;
      candidate.contact = contact || phone;
    }
    if (gender !== undefined) candidate.gender = gender;
    if (dob) candidate.dob = new Date(dob);
    if (summary !== undefined) candidate.summary = summary;
    if (aadharStatus) candidate.aadharStatus = aadharStatus;

    // Update password if provided
    if (password) {
      candidate.passwordHash = await bcrypt.hash(password, 10);
    }

    // Handle file uploads
    const uploadDir = path.join(__dirname, '../../uploads');
    if (req.files?.aadhar?.[0]?.path) {
      candidate.aadharFile = path.relative(uploadDir, req.files.aadhar[0].path).replace(/\\/g, '/');
    }
    if (req.files?.profileImage?.[0]?.path) {
      candidate.profileImage = path.relative(uploadDir, req.files.profileImage[0].path).replace(/\\/g, '/');
    }

    // Handle education
    const degreeFiles = req.files?.degreeFile || [];
    console.log('[updateCandidate] Education files received:', degreeFiles.length);
    console.log('[updateCandidate] Education in body:', education);
    
    if (education !== undefined) {
      // If education array is provided, use it and map files to entries
      let educationData = [];
      if (Array.isArray(education) && education.length > 0) {
        let fileIndex = 0;
        
        education.forEach((edu) => {
          let degreeFile = edu.degreeFile;
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
      candidate.education = educationData;
      console.log('[updateCandidate] Education updated from body array:', educationData.length);
    } else if (degreeFiles.length > 0) {
      // If only files are uploaded (no education array), create new entries for each file
      // Preserve existing education entries and append new ones
      const existingEducation = candidate.education || [];
      console.log('[updateCandidate] Existing education entries:', existingEducation.length);
      
      const newEducationEntries = degreeFiles.map((file) => ({
        degree: '',
        university: '',
        year: '',
        degreeFile: path.relative(uploadDir, file.path).replace(/\\/g, '/'),
        status: 'Pending'
      }));
      
      console.log('[updateCandidate] New education entries created:', newEducationEntries.length);
      
      // Append new entries to existing ones
      candidate.education = [...existingEducation, ...newEducationEntries];
      console.log('[updateCandidate] Total education entries after append:', candidate.education.length);
    }

    // Handle experience
    if (experience !== undefined) {
      candidate.experience = Array.isArray(experience) ? experience : [];
    }

    candidate.updatedAt = new Date();
    await candidate.save();

    const candidateResponse = candidate.toObject();
    delete candidateResponse.passwordHash;
    delete candidateResponse.refreshTokens;

    res.json({ message: 'Candidate updated successfully', user: candidateResponse });
  } catch (err) {
    console.error('Update candidate error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// BULK CREATE CANDIDATES
exports.bulkCreateCandidates = async (req, res) => {
  try {
    const { users } = req.body;
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: 'Users array is required' });
    }

    const SALT_ROUNDS = 10;
    const results = { success: [], failed: [] };

    for (const userData of users) {
      try {
        const { fullName, email, password, contact, gender, dob, summary, education, experience } = userData;

        if (!email || !password || !fullName) {
          results.failed.push({
            email: email || 'N/A',
            reason: 'Missing required fields (email, password, or fullName)',
          });
          continue;
        }

        const existing = await Candidate.findOne({ email });
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

        const newCandidateData = {
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
          education: Array.isArray(education) ? education : [],
          experience: Array.isArray(experience) ? experience : []
        };

        const candidate = new Candidate(newCandidateData);
        await candidate.save();

        results.success.push({ email, name: fullName, id: candidate._id });
      } catch (err) {
        console.error(`Error creating candidate ${userData.email}:`, err);
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

// Other methods (block, unblock, delete, etc.) - similar structure
exports.blockCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    candidate.blocked = true;
    await candidate.save();
    res.json({ message: 'Candidate blocked successfully' });
  } catch (err) {
    console.error('Block candidate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unblockCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    candidate.blocked = false;
    await candidate.save();
    res.json({ message: 'Candidate unblocked successfully' });
  } catch (err) {
    console.error('Unblock candidate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.softDeleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    candidate.deleted = true;
    await candidate.save();
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    console.error('Delete candidate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendPasswordResetEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);
    candidate.passwordResetToken = resetToken;
    candidate.passwordResetTokenExpiry = resetTokenExpiry;
    await candidate.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&userId=${candidate._id}`;

    try {
      await sendPasswordResetEmail(candidate.email, resetToken, resetUrl);
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
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    if (candidate.emailVerificationStatus === 'Verified' || candidate.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 86400000);
    candidate.emailVerificationToken = verificationToken;
    candidate.emailVerificationTokenExpiry = tokenExpiry;
    await candidate.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}&userId=${candidate._id}`;

    try {
      await sendEmailVerificationEmail(candidate.email, verificationToken, verificationUrl);
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

    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    if (candidate.emailVerificationStatus === 'Verified' || candidate.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    if (!candidate.emailVerificationToken || candidate.emailVerificationToken !== token) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    if (candidate.emailVerificationTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    candidate.emailVerified = true;
    candidate.emailVerificationStatus = 'Verified';
    candidate.emailVerificationToken = undefined;
    candidate.emailVerificationTokenExpiry = undefined;
    candidate.updatedAt = new Date();
    await candidate.save();

    res.json({ 
      message: 'Email verified successfully', 
      user: {
        _id: candidate._id,
        email: candidate.email,
        emailVerified: candidate.emailVerified,
        emailVerificationStatus: candidate.emailVerificationStatus
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
    console.log('[changePassword] Request received:', { 
      method: req.method, 
      path: req.path,
      id: req.params.id,
      bodyKeys: Object.keys(req.body || {})
    });
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

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    candidate.passwordHash = passwordHash;
    candidate.updatedAt = new Date();
    await candidate.save();

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

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (documentType === 'aadhar') {
      candidate.aadharStatus = status;
    } else if (documentType === 'education') {
      if (educationIndex === undefined || educationIndex === null) {
        return res.status(400).json({ message: 'Education index is required for education status update' });
      }
      if (!candidate.education || !candidate.education[educationIndex]) {
        return res.status(404).json({ message: 'Education entry not found' });
      }
      candidate.education[educationIndex].status = status;
    } else {
      return res.status(400).json({ message: 'Invalid document type. Must be aadhar or education' });
    }

    candidate.updatedAt = new Date();
    await candidate.save();

    const candidateResponse = candidate.toObject();
    delete candidateResponse.passwordHash;
    delete candidateResponse.refreshTokens;

    res.json({ message: 'Document status updated successfully', user: candidateResponse });
  } catch (err) {
    console.error('Update document status error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

