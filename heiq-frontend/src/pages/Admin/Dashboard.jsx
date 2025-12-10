import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import AdminLayout from "../../components/layout/AdminLayout";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";

// Reusable components
import StatBox from "../../components/ui/StatBox";
import AlertsContainer from "../../components/ui/AlertsContainer";
import AlertBox from "../../components/ui/AlertBox";
import SystemActivityChart from "../../components/ui/SystemActivityChart";
import SupportTable from "../../components/ui/SupportTable";

// Icons
import { FiUsers, FiBriefcase, FiFileText, FiBarChart } from "react-icons/fi";

const Dashboard = () => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  // Support table sample data
  const tableData = [
    { id: "TKT-1023", category: "Login Issue", agent: "Sarah M.", status: "Open", age: 52 },
    { id: "TKT-1024", category: "Payment", agent: "John D.", status: "In Progress", age: 24 },
    { id: "TKT-1025", category: "Assessment", agent: "Mike R.", status: "Open", age: 68 },
    { id: "TKT-1026", category: "Job Posting", agent: "Emma L.", status: "Waiting", age: 12 },
    { id: "TKT-1027", category: "Profile", agent: "Sarah M.", status: "Open", age: 36 },
  ];

  return (
    <AdminLayout>
      {/* PAGE HEADER */}
      <h2 className="fw-bold mb-2" style={{ color: themeColors.text }}>
        Dashboard
      </h2>
      <p style={{ color: themeColors.textSecondary }}>
        Welcome back, Admin. Here's what's happening today.
      </p>

      {/* ───────────────────────────── */}
      {/* METRICS */}
      {/* ───────────────────────────── */}
      <Row className="g-4 mt-2">
        <Col lg={2} md={4} sm={6}>
          <StatBox
            title="Total Users"
            value="1,247"
            change="+12%"
            icon={<FiUsers />}
            theme={themeColors}
          />
        </Col>

        <Col lg={2} md={4} sm={6}>
          <StatBox
            title="Active User "
            value="892"
            change="+8%"
            icon={<FiUsers />}
            theme={themeColors}
          />
        </Col>

        <Col lg={2} md={4} sm={6}>
          <StatBox
            title="Total User"
            value="8,543"
            change="+8%"
            icon={<FiBriefcase />}
            theme={themeColors}
          />
        </Col>

        <Col lg={2} md={4} sm={6}>
          <StatBox
            title="Active Job Listings"
            value="342"
            change="+3%"
            icon={<FiFileText />}
            theme={themeColors}
          />
        </Col>

        <Col lg={2} md={4} sm={6}>
          <StatBox
            title="Open Tickets"
            value="47"
            change="-5%"
            icon={<FiBarChart />}
            theme={themeColors}
          />
        </Col>

        <Col lg={2} md={4} sm={6}>
          <StatBox
            title="Pending Assessments"
            value="128"
            change="+2%"
            icon={<FiFileText />}
            theme={themeColors}
          />
        </Col>
      </Row>

      {/* ───────────────────────────── */}
      {/* ALERTS + GRAPH SIDE BY SIDE */}
      {/* ───────────────────────────── */}
      <Row className="mt-4 g-4">
        
        {/* LEFT: ALERTS */}
        <Col lg={6}>
          <AlertsContainer theme={themeColors}>
            <AlertBox
              borderColor="#ffcccc"
              dotColor="red"
              title="5 Tickets > 48 hours old"
              description="Requires immediate attention"
            />

             <AlertBox
              borderColor="#ffcccc"
              dotColor="red"
              title="10 Employer with expired job plan"
              description="Subscription renewal needed"
            />

            <AlertBox
              borderColor="#ffe9a6"
              dotColor="#f7c600"
              title="2 Employers waiting approval"
              description="Pending verification"
            />

            <AlertBox
              borderColor="#ffd8b1"
              dotColor="#ff8d3a"
              title="14 Candidates stuck at assessment"
              description="Technical issues reported"
            />

            <AlertBox
              borderColor="#ffcccc"
              dotColor="red"
              title="1 Employer with expired job plan"
              description="Subscription renewal needed"
            />
          </AlertsContainer>
        </Col>

        {/* RIGHT: GRAPH */}
        <Col lg={6}>
          <Card
            className="shadow-sm border-0 h-100"
            style={{
              borderRadius: "18px",
              backgroundColor: themeColors.surface,
              padding: "20px",
            }}
          >
            <SystemActivityChart theme={themeColors} />
          </Card>
        </Col>

      </Row>

      {/* ───────────────────────────── */}
      {/* SUPPORT TABLE */}
      {/* ───────────────────────────── */}
      <Card
        className="mt-4 border-0 shadow-sm"
        style={{
          borderRadius: "18px",
          backgroundColor: themeColors.surface,
        }}
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold" style={{ color: themeColors.text }}>
              Support Workload Overview
            </h5>
            <Button variant="link" className="p-0">View All</Button>
          </div>

          <SupportTable theme={themeColors} data={tableData} />
        </Card.Body>
      </Card>

    </AdminLayout>
  );
};

export default Dashboard;
