import React, { useState } from "react";
import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar";
import { Row, Col, Card } from "react-bootstrap";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        style={{
          marginLeft: isSidebarOpen ? "280px" : "0px",
          transition: "0.3s",
          padding: "20px",
        }}
      >
        <h2 className="mt-3">Welcome Admin</h2>

        <Row className="mt-4">
          <Col md={4} className="mb-3">
            <Card className="p-4 shadow-sm">
              <h5>Total Users</h5>
              <h2>560</h2>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card className="p-4 shadow-sm">
              <h5>Active Jobs</h5>
              <h2>120</h2>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card className="p-4 shadow-sm">
              <h5>Reports</h5>
              <h2>32</h2>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
