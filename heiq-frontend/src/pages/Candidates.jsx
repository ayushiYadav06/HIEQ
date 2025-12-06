import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import TopNavbar from "../components/layout/TopNavbar";
import BackButton from "../components/layout/BackButton";
import Tabs from "../components/ui/Tabs";
import SearchInput from "../components/ui/SearchInput";
import DateTabs from "../components/ui/DateTabs";
import PageTitle from "../components/ui/PageTitle";
import ExportButton from "../components/ui/ExportButton";
import FilterDropdown from "../components/ui/FilterDropdown";
import StatisticsRow from "../components/ui/StatisticsRow";
import DataTable from "../components/ui/DataTable";

const Candidates = () => {
  const [filterBy, setFilterBy] = useState("Email ID");

  const stats = [
    { title: "Total", value: 120, color: "#4CAF50" },
    { title: "Verified", value: 80, color: "green" },
    { title: "Unverified", value: 40, color: "red" },
    { title: "Active", value: 95, color: "#007bff" },
    { title: "Deactivated", value: 25, color: "#777" },
  ];

  const columns = [
    "Name",
    "Email ID",
    "Phone",
    "Verification Status",
    "Account Status",
    "Registered on",
  ];

  const data = [
    {
      "Name": "S. NO. Aman Garg",
      "Email ID": "aman@gmail.com",
      "Phone": "1234567890",
      "Verification Status": "Verified",
      "Account Status": "Active",
      "Registered on": "20-12-2022",
    },
    {
      "Name": "Abhya Ram",
      "Email ID": "abhay@gmail.com",
      "Phone": "1234567890",
      "Verification Status": "Unverified",
      "Account Status": "Deactivated",
      "Registered on": "16-12-2022",
    },
  ];

  return (
    <>
      <TopNavbar />

      <Container fluid className="mt-4 px-4">

        {/* BACK BUTTON */}
        <BackButton label="Back" />

        {/* PAGE TITLE */}
        <PageTitle title="Users list" />

        {/* TABS */}
        <div className="mt-3 mb-4" style={{ maxWidth: "350px" }}>
          <Tabs tabs={["Candidates", "Employers"]} active="Candidates" />
        </div>

        {/* STATISTICS */}
        <StatisticsRow stats={stats} />

        {/* ---------------- FILTERS ROW ---------------- */}
        <Row className="g-3 align-items-center mb-4">

          {/* EXPORT BUTTON */}
          <Col xs={12} md={3} lg={2}>
            <ExportButton />
          </Col>

          {/* SEARCH BOX */}
          <Col xs={12} md={4} lg={4}>
            <SearchInput placeholder="Enter search here..." />
          </Col>

          {/* FILTER DROPDOWN */}
          <Col xs={12} md={3} lg={3}>
            <FilterDropdown value={filterBy} setValue={setFilterBy} />
          </Col>

          {/* DATE PICKER */}
          <Col xs={12} md={2} lg={3}>
            <DateTabs />
          </Col>

        </Row>

        {/* ---------------- DATA TABLE ---------------- */}
        <DataTable columns={columns} rows={data} />
      </Container>
    </>
  );
};

export default Candidates;
