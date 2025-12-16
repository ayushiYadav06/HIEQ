// pages/Admin/UserForm.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import BackButton from "../../components/layout/BackButton";
import Tabs from "../../components/ui/Tabs";
import { candidateAPI, employerAPI, roleAPI, userAPI } from "../../services/api";

const UserForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editUserId = searchParams.get("edit");
  const isEditMode = !!editUserId;
  
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [showPassword, setShowPassword] = useState(false);
  const [contactError, setContactError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  // ⭐ ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState("Candidate");

  // ⭐ FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    contact: "",
    gender: "",
    dob: "",
    summary: "",
    aadhar: null,
    profileImage: null,

    // Candidate fields
    education: [{ degree: "", university: "", year: "", degreeFile: null }],
    experience: [{ company: "", role: "", years: "" }],

    // Employer fields
    skills: [""],
    companyExperience: [{ company: "", role: "", years: "" }],
  });

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleAPI.getAllRoles();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    fetchRoles();
  }, []);

  // Load user data in edit mode
  useEffect(() => {
    const loadUserData = async () => {
      if (!isEditMode || !editUserId) return;

      setIsLoadingUser(true);
      setError("");
      try {
        // Try to fetch from each API to determine user type
        let userData = null;
        let userType = null; // 'candidate', 'employer', or 'admin'
        
        // Try candidate API first
        try {
          userData = await candidateAPI.getById(editUserId);
          userType = 'candidate';
        } catch (err) {
          // Try employer API
          try {
            userData = await employerAPI.getById(editUserId);
            userType = 'employer';
          } catch (err2) {
            // Try admin/user API
            try {
              userData = await userAPI.getById(editUserId);
              userType = 'admin';
            } catch (err3) {
              throw new Error("User not found");
            }
          }
        }

        if (userData) {
          // Determine active tab based on user type and role
          if (userType === 'employer') {
            setActiveTab("Employer");
          } else if (userType === 'admin' || (userData.role && ["ADMIN", "SUPER_ADMIN", "CONTENT_ADMIN", "VERIFICATION_ADMIN", "SUPPORT_ADMIN"].includes(userData.role))) {
            setActiveTab("Admin");
          } else {
            setActiveTab("Candidate");
          }

          // Determine default role based on user type
          // For employers, they don't have a role field, so we'll use EMPLOYER
          // For candidates, they might have STUDENT or JOB_SEEKER role
          // For admins, use their actual role
          let defaultRole = "STUDENT";
          if (userType === 'employer') {
            defaultRole = "EMPLOYER";
          } else if (userType === 'admin' && userData.role) {
            // For admin users, use their actual role
            defaultRole = userData.role;
          } else if (userData.role) {
            // For candidates, use their role if available
            defaultRole = userData.role;
          }

          // Ensure the role exists in the roles list (validate against fetched roles)
          // If roles haven't loaded yet, the role will be set when roles load
          const validateRole = (roleValue) => {
            if (roles.length > 0 && roleValue) {
              // Normalize comparison - roles are stored in uppercase in DB
              const normalizedRole = roleValue.toUpperCase();
              const roleExists = roles.some(role => role.name.toUpperCase() === normalizedRole);
              
              if (roleExists) {
                // Return the exact role name from the roles list to ensure case matching
                const foundRole = roles.find(role => role.name.toUpperCase() === normalizedRole);
                return foundRole ? foundRole.name : roleValue;
              } else {
                // If role doesn't exist, try to find a matching role or use first available
                let matchingRole = null;
                if (userType === 'employer') {
                  matchingRole = roles.find(r => 
                    r.name.toUpperCase() === "EMPLOYER" || r.name.toUpperCase() === "EMPLOYEE"
                  );
                } else if (userType === 'admin') {
                  matchingRole = roles.find(r => 
                    ['SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN', 'VERIFICATION_ADMIN', 'SUPPORT_ADMIN']
                      .includes(r.name.toUpperCase())
                  );
                } else {
                  matchingRole = roles.find(r => 
                    r.name.toUpperCase() === "STUDENT" || 
                    r.name.toUpperCase() === "CANDIDATE" ||
                    r.name.toUpperCase() === "JOB_SEEKER"
                  );
                }
                return matchingRole ? matchingRole.name : roles[0].name;
              }
            }
            return roleValue;
          };

          // Pre-populate form data
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            password: "", // Don't pre-fill password
            role: validateRole(defaultRole), // Use the determined default role - this will be the current role
            contact: userData.contact || userData.phone || "",
            gender: userData.gender || "",
            dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : "",
            summary: userData.summary || "",
            aadhar: null, // File input - keep null
            profileImage: null, // File input - keep null

            // Candidate fields
            education: userData.education && userData.education.length > 0 
              ? userData.education.map(edu => ({
                  degree: edu.degree || "",
                  university: edu.university || "",
                  year: edu.year || "",
                  degreeFile: null, // File input - keep null
                }))
              : [{ degree: "", university: "", year: "", degreeFile: null }],

            experience: userData.experience && userData.experience.length > 0
              ? userData.experience
              : [{ company: "", role: "", years: "" }],

            // Employer fields
            skills: userData.skills && userData.skills.length > 0
              ? userData.skills
              : [""],

            companyExperience: userData.companyExperience && userData.companyExperience.length > 0
              ? userData.companyExperience
              : [{ company: "", role: "", years: "" }],
          });
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        setError(error.response?.data?.message || "Failed to load user data. Please try again.");
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserData();
  }, [isEditMode, editUserId]);

  // Validate and update role when roles are loaded (for edit mode)
  useEffect(() => {
    if (isEditMode && roles.length > 0 && formData.role) {
      // Normalize comparison - roles are stored in uppercase
      const normalizedFormRole = formData.role.toUpperCase();
      const roleExists = roles.some(role => role.name.toUpperCase() === normalizedFormRole);
      
      if (!roleExists) {
        // If current role doesn't exist in roles list, find a suitable default
        // Try to find a role that matches the current formData.role value
        const matchingRole = roles.find(r => 
          r.name.toUpperCase() === normalizedFormRole ||
          r.name.toUpperCase() === "STUDENT" || 
          r.name.toUpperCase() === "EMPLOYER" || 
          r.name.toUpperCase() === "EMPLOYEE" ||
          r.name.toUpperCase() === "ADMIN"
        ) || roles[0];
        
        if (matchingRole) {
          setFormData(prev => ({ ...prev, role: matchingRole.name }));
        }
      } else {
        // Ensure we use the exact role name from the roles list (case-sensitive match)
        const exactRole = roles.find(role => role.name.toUpperCase() === normalizedFormRole);
        if (exactRole && exactRole.name !== formData.role) {
          setFormData(prev => ({ ...prev, role: exactRole.name }));
        }
      }
    }
  }, [roles, isEditMode, formData.role]);

  // Basic update
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Aadhar upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, aadhar: e.target.files[0] });
  };

  // Profile image upload
  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.role) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Password is only required for new users
      if (!isEditMode && !formData.password) {
        setError("Password is required for new users");
        setIsSubmitting(false);
        return;
      }

      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add basic fields
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      if (formData.password) {
        submitData.append("password", formData.password);
      }
      submitData.append("role", formData.role);
      submitData.append("contact", formData.contact || "");
      submitData.append("gender", formData.gender || "");
      submitData.append("dob", formData.dob || "");
      submitData.append("summary", formData.summary || "");

      // Add aadhar file
      if (formData.aadhar) {
        submitData.append("aadhar", formData.aadhar);
      }

      // Add profile image
      if (formData.profileImage) {
        submitData.append("profileImage", formData.profileImage);
      }

      // Add education data
      if (activeTab === "Candidate" && formData.education) {
        let fileIndex = 0;
        formData.education.forEach((edu, index) => {
          submitData.append(`education[${index}][degree]`, edu.degree || "");
          submitData.append(`education[${index}][university]`, edu.university || "");
          submitData.append(`education[${index}][year]`, edu.year || "");
          if (edu.degreeFile) {
            submitData.append("degreeFile", edu.degreeFile);
            fileIndex++;
          }
        });
      }

      // Add experience data
      if (activeTab === "Candidate" && formData.experience) {
        submitData.append("experience", JSON.stringify(formData.experience));
      }

      // Add skills
      if (activeTab === "Employer" && formData.skills) {
        submitData.append("skills", JSON.stringify(formData.skills.filter(s => s.trim() !== "")));
      }

      // Add company experience
      if (activeTab === "Employer" && formData.companyExperience) {
        submitData.append("companyExperience", JSON.stringify(formData.companyExperience));
      }

      // Submit to appropriate API based on active tab
      let api;
      if (activeTab === "Candidate") {
        api = candidateAPI;
      } else if (activeTab === "Employer") {
        api = employerAPI;
      } else if (activeTab === "Admin") {
        api = userAPI;
        // For admin users, ensure role is set to one of the admin roles
        if (!formData.role || !["ADMIN", "SUPER_ADMIN", "CONTENT_ADMIN", "VERIFICATION_ADMIN", "SUPPORT_ADMIN"].includes(formData.role)) {
          setError("Please select a valid admin role");
          setIsSubmitting(false);
          return;
        }
      } else {
        api = candidateAPI; // Default fallback
      }

      if (isEditMode && editUserId) {
        // Update existing user
        const response = await api.update(editUserId, submitData);
        
        // Update formData with the response role if available
        if (response.user && response.user.role) {
          // Normalize comparison - roles are stored in uppercase
          const normalizedResponseRole = response.user.role.toUpperCase();
          const roleExists = roles.some(role => role.name.toUpperCase() === normalizedResponseRole);
          
          if (roleExists) {
            // Get the exact role name from the roles list to ensure case matching
            const exactRole = roles.find(role => role.name.toUpperCase() === normalizedResponseRole);
            if (exactRole) {
              setFormData(prev => ({ ...prev, role: exactRole.name }));
            }
          }
        }
        
        // Check if user was migrated to a different model
        if (response.migrated) {
          alert(`User updated and migrated to ${response.user.role || 'new role'} successfully! The user will now appear in the ${response.user.role === 'EMPLOYER' || response.user.role === 'EMPLOYEE' ? 'Employers' : response.user.role && ['SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN', 'VERIFICATION_ADMIN', 'SUPPORT_ADMIN'].includes(response.user.role) ? 'Admins' : 'Candidates'} table.`);
        } else {
          alert(`${activeTab} updated successfully!`);
        }
      } else {
        // Create new user
        await api.create(submitData);
        alert(`${activeTab} created successfully!`);
      }
      
      navigate("/admin/candidates");
    } catch (error) {
      console.error("Failed to create user:", error);
      setError(error.response?.data?.message || "Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Candidate: add education
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { degree: "", university: "", year: "", degreeFile: null },
      ],
    });
  };

  // Candidate: add experience
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { company: "", role: "", years: "" },
      ],
    });
  };

  // Employer: add skill
  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, ""],
    });
  };

  // Employer: add company experience
  const addCompanyExperience = () => {
    setFormData({
      ...formData,
      companyExperience: [
        ...formData.companyExperience,
        { company: "", role: "", years: "" },
      ],
    });
  };

  // ⭐⭐⭐ SUBMIT HANDLER — PRINT IN CONSOLE ⭐⭐⭐
  return (
    <AdminLayout>
      <BackButton label="Back" onClick={() => navigate(-1)} />

      <div className="mt-4">
        <Card
          className="p-4 shadow-lg"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          }}
        >
          <h3
            className="mb-4 text-center"
            style={{ color: themeColors.text }}
          >
            {isEditMode ? "Update User" : "Create New User"}
          </h3>

          {isLoadingUser && (
            <div className="text-center mb-3">
              <div style={{ color: themeColors.text }}>Loading user data...</div>
            </div>
          )}

          {error && (
            <div
              className="alert alert-danger"
              style={{ marginBottom: "20px" }}
            >
              {error}
            </div>
          )}

          {/* ============================================= */}
          {/* ⭐⭐⭐ TABS AT THE TOP ⭐⭐⭐ */}
          {/* ============================================= */}
          <Tabs
            active={activeTab}
            setActive={setActiveTab}
            tabs={["Candidate", "Employer", "Admin"]}
          />

          {/* ============================================= */}
          {/* ⭐ BASIC FIELDS (VISIBLE FOR BOTH TABS) ⭐ */}
          {/* ============================================= */}

          <Form onSubmit={handleSubmit}>
            <h5 className="mt-4" style={{ color: themeColors.text }}>Basic Information</h5>

            {/* FULL NAME */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Full Name *</Form.Label>
              <Form.Control
                name="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
            </Form.Group>

            {/* ROLE */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Role *</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              >
                {roles.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.displayName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* EMAIL */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Email Address *</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>
                Password {!isEditMode && "*"}
              </Form.Label>
              <InputGroup>
                <Form.Control
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
                  value={formData.password}
                  onChange={handleChange}
                  required={!isEditMode}
                  style={{
                    backgroundColor: themeColors.inputBackground,
                    color: themeColors.text,
                    borderColor: themeColors.border,
                  }}
                />
                <InputGroup.Text
                  style={{
                    cursor: "pointer",
                    backgroundColor: themeColors.inputBackground,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </InputGroup.Text>
              </InputGroup>
              {isEditMode && (
                <Form.Text style={{ color: themeColors.textSecondary }}>
                  Leave blank to keep the current password
                </Form.Text>
              )}
            </Form.Group>

            {/* CONTACT */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Contact Number</Form.Label>
              <Form.Control
                name="contact"
                value={formData.contact}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^\d*$/.test(value)) return;
                  setFormData({ ...formData, contact: value });
                  setContactError(
                    value.length === 10
                      ? ""
                      : "Contact number must be exactly 10 digits."
                  );
                }}
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
              {contactError && (
                <small style={{ color: "red" }}>{contactError}</small>
              )}
            </Form.Group>

            {/* GENDER */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            {/* DOB */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Date of Birth</Form.Label>
              <Form.Control
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
            </Form.Group>

            {/* SUMMARY */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Profile Summary</Form.Label>
              <Form.Control
                name="summary"
                as="textarea"
                rows={3}
                placeholder="Write summary"
                value={formData.summary}
                onChange={handleChange}
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
            </Form.Group>

            {/* PROFILE IMAGE */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Profile Image</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleProfileImageChange}
                    style={{
                      backgroundColor: themeColors.inputBackground,
                      color: themeColors.text,
                      borderColor: themeColors.border,
                    }}
                  />
                  <Form.Text style={{ color: themeColors.textSecondary }}>
                    Recommended: Square image, max 5MB (JPG, PNG)
                  </Form.Text>
                </Col>
                <Col md={6}>
                  {formData.profileImage && (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: `2px solid ${themeColors.border}`,
                        }}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </Form.Group>

            {/* AADHAR */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Upload Aadhar</Form.Label>
              <Form.Control
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
            </Form.Group>

            {/* ⭐⭐⭐ CANDIDATE SECTION ⭐⭐⭐ */}
            {activeTab === "Candidate" && (
              <>
                <h4 className="mt-4" style={{ color: themeColors.text }}>Candidate Details</h4>

                {/* EDUCATION */}
                <h5 className="mt-3" style={{ color: themeColors.text }}>Education</h5>

                {formData.education.map((edu, index) => (
                  <Row key={index} className="mb-3 align-items-center">
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...formData.education];
                          updated[index].degree = e.target.value;
                          setFormData({ ...formData, education: updated });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                    </Col>

                    <Col md={3}>
                      <Form.Control
                        type="text"
                        placeholder="University"
                        value={edu.university}
                        onChange={(e) => {
                          const updated = [...formData.education];
                          updated[index].university = e.target.value;
                          setFormData({ ...formData, education: updated });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                    </Col>

                    <Col md={2}>
                      <Form.Control
                        type="text"
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => {
                          const updated = [...formData.education];
                          updated[index].year = e.target.value;
                          setFormData({ ...formData, education: updated });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                    </Col>

                    <Col md={4}>
                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => {
                          const updated = [...formData.education];
                          updated[index].degreeFile = e.target.files[0];
                          setFormData({ ...formData, education: updated });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                      <small style={{ color: themeColors.textSecondary }}>
                        Upload certificate
                      </small>
                    </Col>
                  </Row>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addEducation}
                  style={{
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  }}
                >
                  + Add More Education
                </Button>

                {/* EXPERIENCE */}
                <h5 className="mt-4" style={{ color: themeColors.text }}>Experience</h5>

                {formData.experience.map((exp, index) => (
                  <Row key={index} className="mb-3">
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[index].company = e.target.value;
                          setFormData({ ...formData, experience: updated });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                    </Col>

                    <Col md={4}>
                      <Form.Control
                        type="text"
                        placeholder="Role"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[index].role = e.target.value;
                          setFormData({ ...formData, experience: updated });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                    </Col>

                    <Col md={4}>
                      <Form.Control
                        type="text"
                        placeholder="Years"
                        value={exp.years}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[index].years = e.target.value;
                          setFormData({ ...formData, experience: updated });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                    </Col>
                  </Row>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addExperience}
                  style={{
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  }}
                >
                  + Add More Experience
                </Button>
              </>
            )}

            {/* ⭐⭐⭐ EMPLOYER SECTION ⭐⭐⭐ */}
            {activeTab === "Employer" && (
              <>
                <h4 className="mt-4" style={{ color: themeColors.text }}>Employer Details</h4>

                {/* SKILLS */}
                <h5 className="mt-3" style={{ color: themeColors.text }}>Skills Required</h5>

                {formData.skills.map((skill, index) => (
                  <Row key={index} className="mb-3">
                    <Col md={12}>
                      <Form.Control
                        type="text"
                        placeholder="Enter skill"
                        value={skill}
                        onChange={(e) => {
                          const updated = [...formData.skills];
                          updated[index] = e.target.value;
                          setFormData({ ...formData, skills: updated });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                    </Col>
                  </Row>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addSkill}
                  style={{
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  }}
                >
                  + Add More Skill
                </Button>

                {/* COMPANY EXPERIENCE */}
                <h5 className="mt-4" style={{ color: themeColors.text }}>Company Experience</h5>

                {formData.companyExperience.map((exp, index) => (
                  <Row key={index} className="mb-3">
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...formData.companyExperience];
                          updated[index].company = e.target.value;
                          setFormData({
                            ...formData,
                            companyExperience: updated,
                          });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                    </Col>

                    <Col md={4}>
                      <Form.Control
                        type="text"
                        placeholder="Role"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...formData.companyExperience];
                          updated[index].role = e.target.value;
                          setFormData({
                            ...formData,
                            companyExperience: updated,
                          });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                    </Col>

                    <Col md={4}>
                      <Form.Control
                        type="text"
                        placeholder="Years"
                        value={exp.years}
                        onChange={(e) => {
                          const updated = [...formData.companyExperience];
                          updated[index].years = e.target.value;
                          setFormData({
                            ...formData,
                            companyExperience: updated,
                          });
                        }}
                        style={{
                          backgroundColor: themeColors.inputBackground,
                          color: themeColors.text,
                          borderColor: themeColors.border,
                        }}
                      />
                    </Col>
                  </Row>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addCompanyExperience}
                  style={{
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  }}
                >
                  + Add Company Experience
                </Button>
              </>
            )}

            {/* SUBMIT */}
            <div className="text-center mt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || isLoadingUser}
                style={{
                  backgroundColor: colors.primaryGreen,
                  borderColor: colors.primaryGreen,
                  color: "#ffffff",
                  minWidth: "150px",
                }}
              >
                {isSubmitting 
                  ? (isEditMode ? "Updating..." : "Creating...") 
                  : (isEditMode ? "Update User" : "Create User")}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserForm;
