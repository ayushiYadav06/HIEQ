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
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import BackButton from "../../components/layout/BackButton";
import Tabs from "../../components/ui/Tabs";
import { userAPI, roleAPI } from "../../services/api";

const UserForm = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [showPassword, setShowPassword] = useState(false);
  const [contactError, setContactError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      if (!formData.name || !formData.email || !formData.password || !formData.role) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add basic fields
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
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

      // Submit to API
      await userAPI.create(submitData);
      
      alert("User created successfully!");
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
            Create New User
          </h3>

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
            tabs={["Candidate", "Employer"]}
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
                <option value="STUDENT">Job Seeker (Student)</option>
                <option value="EMPLOYER">Employer</option>
                <option value="ADMIN">Admin</option>
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
              <Form.Label style={{ color: themeColors.text }}>Password *</Form.Label>
              <InputGroup>
                <Form.Control
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
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
                disabled={isSubmitting}
                style={{
                  backgroundColor: colors.primaryGreen,
                  borderColor: colors.primaryGreen,
                  color: "#ffffff",
                  minWidth: "150px",
                }}
              >
                {isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserForm;
