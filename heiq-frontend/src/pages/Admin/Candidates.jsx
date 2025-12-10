import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

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
      Name: "S. NO. Aman Garg",
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
    {
      Name: "Abhya Ram",
      "Email ID": "abhay@gmail.com",
      Phone: "1234567890",
      "Verification Status": <span style={{ color: "red" }}>Unverified</span>,
      "Account Status": "Deactivated",
      "Registered on": "16-12-2022",
    },
    {
      Name: "Irfan Khan",
      "Email ID": "irfan@gmail.com",
      Phone: "1234567890",
      "Verification Status": <span style={{ color: "green" }}>Verified</span>,
      "Account Status": "Active",
      "Registered on": "15-12-2022",
    },
    {
      Name: "Vibha",
      "Email ID": "vibha@gmail.com",
      Phone: "1234567890",
      "Verification Status": <span style={{ color: "red" }}>Unverified</span>,
      "Account Status": "Deactivated",
      "Registered on": "14-12-2022",
    },
    {
      Name: "Utkarsh Rawat",
      "Email ID": "utkarsh@gmail.com",
      Phone: "1234567890",
      "Verification Status": <span style={{ color: "green" }}>Verified</span>,
      "Account Status": "Active",
      "Registered on": "14-12-2022",
    },
  ];

  const employerData = [];
  const rows = activeTab === "Candidates" ? candidateData : employerData;

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* TOP NAVBAR */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* BACK BUTTON (NOT SHIFTED) */}
      <Container fluid className="mt-4 px-1">
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <BackButton label="Back" />
        </div>
      </Container>

      {/* MAIN CONTENT—SHIFTED AFTER SIDEBAR */}
      <div
        style={{
          paddingLeft: "215px", // ⭐ start exactly after sidebar
          paddingRight: "20px",
          marginTop: "20px",
        }}
      >
        {/* TITLE */}
        <PageTitle title="Users List" />

        {/* TABS */}
        <div className="mb-4">
          <Tabs
            tabs={["Candidates", "Employers"]}
            active={activeTab}
            setActive={setActiveTab}
            fullWidth
          />
        </div>

        {/* FILTER BAR */}
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

        {/* TABLE */}
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
