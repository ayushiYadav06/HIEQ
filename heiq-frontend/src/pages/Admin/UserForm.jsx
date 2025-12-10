// pages/Admin/UserForm.jsx
import React, { useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Container,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar";
import BackButton from "../../components/layout/BackButton";

// ⭐ IMPORT YOUR CUSTOM TABS
import Tabs from "../../components/ui/Tabs";

const UserForm = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [contactError, setContactError] = useState("");

  // ⭐ ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState("Candidate");

  // ⭐ FORM STATE
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    contact: "",
    gender: "",
    dob: "",
    summary: "",
    aadhar: null,

    // Candidate fields
    education: [{ degree: "", university: "", year: "", degreeFile: null }],
    experience: [{ company: "", role: "", years: "" }],

    // Employer fields
    skills: [""],
    companyExperience: [{ company: "", role: "", years: "" }],
  });

  // Basic update
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Aadhar upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, aadhar: e.target.files[0] });
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

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* NAVBAR */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* BACK BUTTON */}
      <Container fluid className="px-0 mt-4">
        <BackButton label="Back" onClick={() => navigate(-1)} />
      </Container>

      {/* PAGE CONTENT AREA */}
      <div
        style={{
          paddingLeft: "215px",
          paddingRight: "20px",
          marginTop: "20px",
        }}
      >
        <Card
          className="p-4 shadow-lg"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <h3 className="mb-4 text-center">Create New User</h3>

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

          <Form>
            <h5 className="mt-4">Basic Information</h5>

            {/* FULL NAME */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="fullName"
                type="text"
                placeholder="Enter full name"
                onChange={handleChange}
              />
            </Form.Group>

            {/* EMAIL */}
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter email"
                onChange={handleChange}
              />
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  onChange={handleChange}
                />
                <InputGroup.Text
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            {/* CONTACT */}
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
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
              />
              {contactError && (
                <small style={{ color: "red" }}>{contactError}</small>
              )}
            </Form.Group>

            {/* GENDER */}
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" onChange={handleChange}>
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>

            {/* DOB */}
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                name="dob"
                type="date"
                onChange={handleChange}
              />
            </Form.Group>

            {/* SUMMARY */}
            <Form.Group className="mb-3">
              <Form.Label>Profile Summary</Form.Label>
              <Form.Control
                name="summary"
                as="textarea"
                rows={3}
                placeholder="Write summary"
                onChange={handleChange}
              />
            </Form.Group>

            {/* AADHAR */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Aadhar</Form.Label>
              <Form.Control
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />
            </Form.Group>

            {/* ======================================================== */}
            {/* ⭐⭐⭐ CANDIDATE SECTION ⭐⭐⭐ */}
            {/* ======================================================== */}

            {activeTab === "Candidate" && (
              <>
                <h4 className="mt-4">Candidate Details</h4>

                {/* EDUCATION */}
                <h5 className="mt-3">Education</h5>

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
                      />
                      <small className="text-muted">
                        Upload certificate
                      </small>
                    </Col>
                  </Row>
                ))}

                <Button variant="secondary" size="sm" onClick={addEducation}>
                  + Add More Education
                </Button>

                {/* EXPERIENCE */}
                <h5 className="mt-4">Experience</h5>

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
                      />
                    </Col>
                  </Row>
                ))}

                <Button variant="secondary" size="sm" onClick={addExperience}>
                  + Add More Experience
                </Button>
              </>
            )}

            {/* ======================================================== */}
            {/* ⭐⭐⭐ EMPLOYER SECTION ⭐⭐⭐ */}
            {/* ======================================================== */}

            {activeTab === "Employer" && (
              <>
                <h4 className="mt-4">Employer Details</h4>

                {/* SKILLS */}
                <h5 className="mt-3">Skills Required</h5>

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
                      />
                    </Col>
                  </Row>
                ))}

                <Button variant="secondary" size="sm" onClick={addSkill}>
                  + Add More Skill
                </Button>

                {/* COMPANY EXPERIENCE */}
                <h5 className="mt-4">Company Experience</h5>

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
                      />
                    </Col>
                  </Row>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addCompanyExperience}
                >
                  + Add Company Experience
                </Button>
              </>
            )}

            {/* SUBMIT */}
            <div className="text-center mt-4">
              <Button variant="primary" type="submit">
                Submit Form
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default UserForm;
