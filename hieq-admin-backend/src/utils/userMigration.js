const Candidate = require('../models/Candidate');
const Employer = require('../models/Employer');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');
console.log("User Migration Utility Loaded");

/**
 * Migrate user from one model to another based on role change
 * @param {String} userId - Current user ID
 * @param {String} currentType - 'candidate', 'employer', or 'admin'
 * @param {String} newRole - New role (CANDIDATE, EMPLOYER, or ADMIN roles)
 * @param {Object} updateData - Data to update (from req.body)
 * @param {Object} files - Uploaded files (from req.files)
 * @returns {Object} - New user object and type
 */
const migrateUser = async (userId, currentType, newRole, updateData, files) => {
  // Parse JSON strings from FormData if needed
  let education = updateData.education;
  let experience = updateData.experience;
  let skills = updateData.skills;
  let companyExperience = updateData.companyExperience;
  
  // Parse experience
  if (typeof experience === 'string') {
    try {
      experience = JSON.parse(experience);
    } catch (e) {
      experience = [];
    }
  }
  
  // Parse skills
  if (typeof skills === 'string') {
    try {
      skills = JSON.parse(skills);
    } catch (e) {
      skills = [];
    }
  }
  
  // Parse companyExperience
  if (typeof companyExperience === 'string') {
    try {
      companyExperience = JSON.parse(companyExperience);
    } catch (e) {
      companyExperience = [];
    }
  }
  
  // Handle education from FormData format
  if (education !== undefined && !Array.isArray(education)) {
    if (typeof education === 'string') {
      try {
        education = JSON.parse(education);
      } catch (e) {
        education = [];
      }
    } else if (typeof education === 'object') {
      // Handle FormData object format - this will be handled in the controller
      education = undefined; // Let it be handled below
    }
  }
  
  // Update updateData with parsed values
  updateData = {
    ...updateData,
    education,
    experience,
    skills,
    companyExperience
  };
  const uploadDir = path.join(__dirname, '../../uploads');
  
  // Determine target type based on new role
  const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN', 'VERIFICATION_ADMIN', 'SUPPORT_ADMIN'];
  let targetType = 'candidate'; // default
  
  if (adminRoles.includes(newRole)) {
    targetType = 'admin';
  } else if (newRole === 'EMPLOYER' || newRole === 'EMPLOYEE') {
    targetType = 'employer';
  } else {
    targetType = 'candidate';
  }

  // If target type is same as current, no migration needed
  if (targetType === currentType) {
    return { migrated: false, type: currentType };
  }

  // Get current user data
  let currentUser = null;
  if (currentType === 'candidate') {
    currentUser = await Candidate.findById(userId);
  } else if (currentType === 'employer') {
    currentUser = await Employer.findById(userId);
  } else if (currentType === 'admin') {
    currentUser = await User.findById(userId);
  }

  if (!currentUser) {
    throw new Error('User not found');
  }

  // Prepare data for new model
  const userData = {
    name: updateData.name !== undefined ? updateData.name : currentUser.name,
    email: updateData.email !== undefined ? updateData.email : currentUser.email,
    passwordHash: updateData.password ? await bcrypt.hash(updateData.password, 10) : currentUser.passwordHash,
    phone: updateData.phone || updateData.contact || currentUser.phone || currentUser.contact,
    contact: updateData.contact || updateData.phone || currentUser.contact || currentUser.phone,
    gender: updateData.gender !== undefined ? updateData.gender : currentUser.gender,
    dob: updateData.dob ? new Date(updateData.dob) : currentUser.dob,
    summary: updateData.summary !== undefined ? updateData.summary : currentUser.summary,
    aadharFile: currentUser.aadharFile,
    aadharStatus: updateData.aadharStatus || currentUser.aadharStatus,
    profileImage: currentUser.profileImage,
    emailVerified: currentUser.emailVerified,
    emailVerificationStatus: currentUser.emailVerificationStatus,
    blocked: currentUser.blocked,
    deleted: currentUser.deleted,
    refreshTokens: currentUser.refreshTokens || [],
    createdAt: currentUser.createdAt,
    updatedAt: new Date()
  };

  // Handle file uploads
  if (files?.aadhar?.[0]?.path) {
    userData.aadharFile = path.relative(uploadDir, files.aadhar[0].path).replace(/\\/g, '/');
  }
  if (files?.profileImage?.[0]?.path) {
    userData.profileImage = path.relative(uploadDir, files.profileImage[0].path).replace(/\\/g, '/');
  }

  // Add role-specific fields
  if (targetType === 'admin') {
    userData.role = newRole;
    userData.permissions = updateData.permissions || currentUser.permissions || [];
  } else if (targetType === 'candidate') {
    // Parse education from FormData or use existing
    if (updateData.education !== undefined) {
      let educationData = [];
      
      // Handle FormData format: education[0][degree], education[0][university], etc.
      if (typeof updateData.education === 'string') {
        try {
          educationData = JSON.parse(updateData.education);
        } catch (e) {
          educationData = [];
        }
      } else if (Array.isArray(updateData.education)) {
        educationData = updateData.education;
      } else if (typeof updateData.education === 'object') {
        // Handle FormData object format
        const educationKeys = Object.keys(updateData.education).filter(key => key.startsWith('education['));
        if (educationKeys.length > 0) {
          const educationMap = {};
          educationKeys.forEach(key => {
            const match = key.match(/education\[(\d+)\]\[(\w+)\]/);
            if (match) {
              const index = parseInt(match[1]);
              const field = match[2];
              if (!educationMap[index]) educationMap[index] = {};
              educationMap[index][field] = updateData.education[key];
            }
          });
          educationData = Object.values(educationMap);
        }
      }
      
      // Process education data with files
      if (educationData.length > 0) {
        const degreeFiles = files?.degreeFile || [];
        let fileIndex = 0;
        
        const processedEducation = educationData.map((edu) => {
          let degreeFile = null;
          if (fileIndex < degreeFiles.length) {
            degreeFile = path.relative(uploadDir, degreeFiles[fileIndex].path).replace(/\\/g, '/');
            fileIndex++;
          } else if (edu.degreeFile && typeof edu.degreeFile === 'string') {
            degreeFile = edu.degreeFile;
          }
          
          return {
            degree: edu.degree || '',
            university: edu.university || '',
            year: edu.year || '',
            degreeFile: degreeFile,
            status: edu.status || 'Pending'
          };
        });
        userData.education = processedEducation;
      } else {
        userData.education = [];
      }
    } else if (currentUser.education) {
      userData.education = currentUser.education;
    } else {
      userData.education = [];
    }

    // Handle experience
    if (updateData.experience !== undefined) {
      if (typeof updateData.experience === 'string') {
        try {
          userData.experience = JSON.parse(updateData.experience);
        } catch (e) {
          userData.experience = [];
        }
      } else {
        userData.experience = Array.isArray(updateData.experience) ? updateData.experience : [];
      }
    } else if (currentUser.experience) {
      userData.experience = currentUser.experience;
    } else {
      userData.experience = [];
    }
  } else if (targetType === 'employer') {
    // Handle skills
    if (updateData.skills !== undefined) {
      if (typeof updateData.skills === 'string') {
        try {
          userData.skills = JSON.parse(updateData.skills);
        } catch (e) {
          userData.skills = [];
        }
      } else {
        userData.skills = Array.isArray(updateData.skills) ? updateData.skills : [];
      }
    } else if (currentUser.skills) {
      userData.skills = currentUser.skills;
    } else {
      userData.skills = [];
    }

    // Handle company experience
    if (updateData.companyExperience !== undefined) {
      if (typeof updateData.companyExperience === 'string') {
        try {
          userData.companyExperience = JSON.parse(updateData.companyExperience);
        } catch (e) {
          userData.companyExperience = [];
        }
      } else {
        userData.companyExperience = Array.isArray(updateData.companyExperience) ? updateData.companyExperience : [];
      }
    } else if (currentUser.companyExperience) {
      userData.companyExperience = currentUser.companyExperience;
    } else {
      userData.companyExperience = [];
    }
  }

  // Create new user in target model
  let newUser = null;
  if (targetType === 'candidate') {
    newUser = new Candidate(userData);
  } else if (targetType === 'employer') {
    newUser = new Employer(userData);
  } else if (targetType === 'admin') {
    newUser = new User(userData);
  }

  await newUser.save();

  // Delete old user
  if (currentType === 'candidate') {
    await Candidate.findByIdAndDelete(userId);
  } else if (currentType === 'employer') {
    await Employer.findByIdAndDelete(userId);
  } else if (currentType === 'admin') {
    await User.findByIdAndDelete(userId);
  }

  // Return response
  const response = newUser.toObject();
  delete response.passwordHash;
  delete response.refreshTokens;

  return {
    migrated: true,
    type: targetType,
    user: response,
    newId: newUser._id
  };
};

module.exports = { migrateUser };

