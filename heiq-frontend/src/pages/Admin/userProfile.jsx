import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import BackButton from "../../components/layout/BackButton";
import ProfileMiniNavbar from "../../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../../components/layout/ProfileCenterBox";
import Tabs from "../../components/ui/Tabs";
import PersonalInformationBox from "../../components/ui/PersonalInformationBox";
import { userAPI } from "../../services/api";
import { Card, Row, Col, Badge, Spinner, Table } from "react-bootstrap";
import UserImage from "../../assets/user.jpg";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const userData = await userAPI.getById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setError("Failed to load user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    const roleColors = {
      ADMIN: "danger",
      SUPER_ADMIN: "danger",
      EMPLOYER: "info",
      STUDENT: "success",
      JOB_SEEKER: "success",
      CONTENT_ADMIN: "warning",
      VERIFICATION_ADMIN: "warning",
      SUPPORT_ADMIN: "warning",
    };
    return roleColors[role] || "secondary";
  };

  // Tab Navigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Account Settings") navigate("/Account-Setting");
    if (tab === "Verify Documents") navigate("/Verify-Documents");
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <BackButton label="Back" />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <BackButton label="Back" />
        <div className="alert alert-danger mt-4">{error || "User not found"}</div>
      </AdminLayout>
    );
  }

  const formValues = {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || user.contact || "",
    gender: user.gender || "Male",
    dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    summary: user.summary || "",
  };

  return (
    <AdminLayout>
      <BackButton label="Back" />

      {/* PROFILE TOP SECTION */}
      <div className="position-relative mt-3" style={{ paddingBottom: "120px" }}>
        <ProfileMiniNavbar
          email={user.email || "N/A"}
          phone={user.phone || user.contact || "N/A"}
          joinedDate={formatDate(user.createdAt)}
          lastSeen={user.updatedAt ? formatDate(user.updatedAt) : "N/A"}
        />

        {/* CENTER BOX */}
        <div
          className="position-absolute start-50 translate-middle-x"
          style={{ top: "-30px" }}
        >
          <ProfileCenterBox
            profileImage={UserImage}
            name={user.name?.toUpperCase() || "N/A"}
            hideButton
          />
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="mt-5">
        <Tabs
          active={activeTab}
          setActive={handleTabChange}
          tabs={["Profile", "Account Settings", "Verify Documents"]}
        />
      </div>

      {/* PROFILE CONTENT */}
      <div className="mt-4">
        {/* Personal Information */}
        <PersonalInformationBox
          profileImage={UserImage}
          values={formValues}
          onChange={() => {}} // Read-only for now
          onUpload={() => alert("Upload clicked")}
        />

        {/* Role and Status Card */}
        <Card
          className="mt-4"
          style={{
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          }}
        >
          <Card.Header
            style={{
              backgroundColor: themeColors.background,
              borderColor: themeColors.border,
            }}
          >
            <h5 style={{ color: themeColors.text, margin: 0 }}>Role & Status</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p style={{ color: themeColors.textSecondary }}>Role:</p>
                <Badge bg={getRoleBadgeColor(user.role)} style={{ fontSize: "14px" }}>
                  {user.role || "N/A"}
                </Badge>
              </Col>
              <Col md={6}>
                <p style={{ color: themeColors.textSecondary }}>Account Status:</p>
                {user.deleted ? (
                  <Badge bg="danger">Deleted</Badge>
                ) : user.blocked ? (
                  <Badge bg="warning">Blocked</Badge>
                ) : (
                  <Badge bg="success">Active</Badge>
                )}
              </Col>
            </Row>
            {user.permissions && user.permissions.length > 0 && (
              <div className="mt-3">
                <p style={{ color: themeColors.textSecondary }}>Permissions:</p>
                <div>
                  {user.permissions.map((perm, index) => (
                    <Badge key={index} bg="secondary" className="me-1">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Education Section (for Candidates/Students) */}
        {user.education && user.education.length > 0 && (
          <Card
            className="mt-4"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <Card.Header
              style={{
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
              }}
            >
              <h5 style={{ color: themeColors.text, margin: 0 }}>Education</h5>
            </Card.Header>
            <Card.Body>
              <Table
                bordered
                hover
                style={{
                  backgroundColor: themeColors.surface,
                  color: themeColors.text,
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: themeColors.background }}>
                    <th style={{ color: themeColors.text }}>Degree</th>
                    <th style={{ color: themeColors.text }}>University</th>
                    <th style={{ color: themeColors.text }}>Year</th>
                    <th style={{ color: themeColors.text }}>Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {user.education.map((edu, index) => (
                    <tr key={index}>
                      <td style={{ color: themeColors.text }}>{edu.degree || "N/A"}</td>
                      <td style={{ color: themeColors.text }}>{edu.university || "N/A"}</td>
                      <td style={{ color: themeColors.text }}>{edu.year || "N/A"}</td>
                      <td style={{ color: themeColors.text }}>
                        {edu.degreeFile ? (
                          <a
                            href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/uploads/${edu.degreeFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: colors.primaryGreen }}
                          >
                            View Certificate
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Experience Section (for Candidates/Students) */}
        {user.experience && user.experience.length > 0 && (
          <Card
            className="mt-4"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <Card.Header
              style={{
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
              }}
            >
              <h5 style={{ color: themeColors.text, margin: 0 }}>Experience</h5>
            </Card.Header>
            <Card.Body>
              <Table
                bordered
                hover
                style={{
                  backgroundColor: themeColors.surface,
                  color: themeColors.text,
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: themeColors.background }}>
                    <th style={{ color: themeColors.text }}>Company</th>
                    <th style={{ color: themeColors.text }}>Role</th>
                    <th style={{ color: themeColors.text }}>Years</th>
                  </tr>
                </thead>
                <tbody>
                  {user.experience.map((exp, index) => (
                    <tr key={index}>
                      <td style={{ color: themeColors.text }}>{exp.company || "N/A"}</td>
                      <td style={{ color: themeColors.text }}>{exp.role || "N/A"}</td>
                      <td style={{ color: themeColors.text }}>{exp.years || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Skills Section (for Employers) */}
        {user.skills && user.skills.length > 0 && (
          <Card
            className="mt-4"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <Card.Header
              style={{
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
              }}
            >
              <h5 style={{ color: themeColors.text, margin: 0 }}>Skills Required</h5>
            </Card.Header>
            <Card.Body>
              <div>
                {user.skills.map((skill, index) => (
                  <Badge key={index} bg="info" className="me-2 mb-2" style={{ fontSize: "14px", padding: "8px 12px" }}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Company Experience Section (for Employers) */}
        {user.companyExperience && user.companyExperience.length > 0 && (
          <Card
            className="mt-4"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <Card.Header
              style={{
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
              }}
            >
              <h5 style={{ color: themeColors.text, margin: 0 }}>Company Experience</h5>
            </Card.Header>
            <Card.Body>
              <Table
                bordered
                hover
                style={{
                  backgroundColor: themeColors.surface,
                  color: themeColors.text,
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: themeColors.background }}>
                    <th style={{ color: themeColors.text }}>Company</th>
                    <th style={{ color: themeColors.text }}>Role</th>
                    <th style={{ color: themeColors.text }}>Years</th>
                  </tr>
                </thead>
                <tbody>
                  {user.companyExperience.map((exp, index) => (
                    <tr key={index}>
                      <td style={{ color: themeColors.text }}>{exp.company || "N/A"}</td>
                      <td style={{ color: themeColors.text }}>{exp.role || "N/A"}</td>
                      <td style={{ color: themeColors.text }}>{exp.years || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Aadhar Document */}
        {user.aadharFile && (
          <Card
            className="mt-4"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <Card.Header
              style={{
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
              }}
            >
              <h5 style={{ color: themeColors.text, margin: 0 }}>Documents</h5>
            </Card.Header>
            <Card.Body>
              <p style={{ color: themeColors.textSecondary }}>Aadhar Document:</p>
              <a
                href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/uploads/${user.aadharFile}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.primaryGreen }}
              >
                View Aadhar Document
              </a>
            </Card.Body>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserProfile;
