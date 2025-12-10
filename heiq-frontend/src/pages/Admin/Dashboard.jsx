import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import { Row, Col, Card } from "react-bootstrap";

const Dashboard = () => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  return (
    <AdminLayout>
      {/* PAGE TITLE */}
      <h2
        className="fw-bold mb-4"
        style={{
          color: themeColors.text,
          fontSize: "24px",
          fontWeight: 600,
        }}
      >
        Welcome, Admin 👋
      </h2>

      {/* METRIC CARDS */}
      <Row className="g-4">
        <Col lg={4} md={6} sm={12}>
          <Card
            className="shadow-sm border-0"
            style={{
              borderRadius: "12px",
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <Card.Body>
              <p
                className="mb-1"
                style={{ color: themeColors.textSecondary, fontSize: "14px" }}
              >
                Total Users
              </p>
              <h2 className="fw-bold" style={{ color: themeColors.text }}>
                560
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12}>
          <Card
            className="shadow-sm border-0"
            style={{
              borderRadius: "12px",
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <Card.Body>
              <p
                className="mb-1"
                style={{ color: themeColors.textSecondary, fontSize: "14px" }}
              >
                Active Jobs
              </p>
              <h2 className="fw-bold" style={{ color: themeColors.text }}>
                120
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12}>
          <Card
            className="shadow-sm border-0"
            style={{
              borderRadius: "12px",
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <Card.Body>
              <p
                className="mb-1"
                style={{ color: themeColors.textSecondary, fontSize: "14px" }}
              >
                Reports
              </p>
              <h2 className="fw-bold" style={{ color: themeColors.text }}>
                32
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Placeholder for charts or tables */}
      <Row className="mt-4">
        <Col md={12}>
          <Card
            className="shadow-sm border-0 p-4"
            style={{
              borderRadius: "12px",
              minHeight: "250px",
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <h5
              className="fw-semibold mb-3"
              style={{ color: themeColors.text }}
            >
              Analytics Overview
            </h5>
            <p style={{ color: themeColors.textSecondary }}>
              Add user activity charts, job stats, or report analysis here...
            </p>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default Dashboard;
