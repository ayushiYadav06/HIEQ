// pages/Admin/Candidates.jsx
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar";
import BackButton from "../../components/layout/BackButton";
import Tabs from "../../components/ui/Tabs";
import SearchInput from "../../components/ui/SearchInput";
import DateTabs from "../../components/ui/DateTabs";
import PageTitle from "../../components/ui/PageTitle";
import ExportButton from "../../components/ui/ExportButton";
import FilterDropdown from "../../components/ui/FilterDropdown";
import DataTable from "../../components/ui/DataTable";

const Candidates = () => {
  const [activeTab, setActiveTab] = useState("Candidates");
  const [filterBy, setFilterBy] = useState("Email ID");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const columns = [
    "Name",
    "Email ID",
    "Phone",
    "Verification Status",
    "Account Status",
    "Registered on",
  ];

  const candidateData = [
    {
      Name: "Aman Garg",
      "Email ID": "aman@gmail.com",
      Phone: "1234567890",
      "Verification Status": <span style={{ color: "green" }}>Verified</span>,
      "Account Status": "Active",
      "Registered on": "20-12-2022",
    },
    {
      Name: "Nived PK",
      "Email ID": "nived@gmail.com",
      Phone: "1234567890",
      "Verification Status": <span style={{ color: "green" }}>Verified</span>,
      "Account Status": "Active",
      "Registered on": "20-12-2022",
    },
  ];

  const employerData = [];
  const rows = activeTab === "Candidates" ? candidateData : employerData;

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Top Navbar */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Back Button */}
      <Container fluid className="mt-4 px-1">
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <BackButton label="Back" />
        </div>
      </Container>

      {/* Main Content */}
      <div style={{ paddingLeft: "215px", paddingRight: "20px", marginTop: "20px" }}>
        
        {/* Title + Create Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <PageTitle title="Users List" />

          <button
            className="create-btn"
            onClick={() => navigate("/create-user")}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <span className="plus">+</span> Create User
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <Tabs
            tabs={["Candidates", "Employers"]}
            active={activeTab}
            setActive={setActiveTab}
            fullWidth
          />
        </div>

        {/* Filter Bar */}
        <Row className="g-3 align-items-center mb-4">
          <Col xs={12} md={6} lg={2}>
            <ExportButton />
          </Col>

          <Col xs={12} md={6} lg={4}>
            <SearchInput placeholder="Enter search here..." />
          </Col>

          <Col xs={12} md={6} lg={3}>
            <FilterDropdown value={filterBy} setValue={setFilterBy} />
          </Col>

          <Col xs={12} md={6} lg={3}>
            <DateTabs />
          </Col>
        </Row>

        {/* Table */}
        <DataTable
          columns={columns}
          rows={rows}
          headerColor="#666666"
          headerBg="#D9D9D95C"
        />
      </div>
    </>
  );
};

export default Candidates;
