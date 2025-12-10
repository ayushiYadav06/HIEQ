import React, { useState, useEffect } from "react";
import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar";
import { Row, Col, Card } from "react-bootstrap";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ⭐ Responsive left padding like other pages
  const [leftPad, setLeftPad] = useState(210);

  useEffect(() => {
    const updatePadding = () => {
      const width = window.innerWidth;

      if (width >= 768) {
        setLeftPad(210); // Tablets & desktop → show sidebar space
      } else {
        setLeftPad(0); // Mobile → sidebar offcanvas
      }
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  return (
    <>
      {/* TOP NAVBAR */}
      <TopNavbar
        isSidebarOpen={isSidebarOpen}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <div
        className="container-fluid"
        style={{
          paddingLeft: `${leftPad}px`,
          paddingRight: "20px",
          paddingTop: "20px",
          transition: "all 0.2s ease",
          minHeight: "100vh",
          background: "#f5f6fa",
        }}
      >
        {/* PAGE TITLE */}
        <h2 className="fw-bold mb-4" style={{ color: "#333" }}>
          Welcome, Admin 👋
        </h2>

        {/* METRIC CARDS */}
        <Row className="g-4">
          <Col lg={4} md={6} sm={12}>
            <Card
              className="shadow-sm border-0"
              style={{ borderRadius: "12px" }}
            >
              <Card.Body>
                <p className="text-muted mb-1">Total Users</p>
                <h2 className="fw-bold">560</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6} sm={12}>
            <Card
              className="shadow-sm border-0"
              style={{ borderRadius: "12px" }}
            >
              <Card.Body>
                <p className="text-muted mb-1">Active Jobs</p>
                <h2 className="fw-bold">120</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6} sm={12}>
            <Card
              className="shadow-sm border-0"
              style={{ borderRadius: "12px" }}
            >
              <Card.Body>
                <p className="text-muted mb-1">Reports</p>
                <h2 className="fw-bold">32</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Placeholder for charts or tables */}
        <Row className="mt-4">
          <Col md={12}>
            <Card
              className="shadow-sm border-0 p-4"
              style={{ borderRadius: "12px", minHeight: "250px" }}
            >
              <h5 className="fw-semibold mb-3">Analytics Overview</h5>
              <p className="text-muted">
                Add user activity charts, job stats, or report analysis here...
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
