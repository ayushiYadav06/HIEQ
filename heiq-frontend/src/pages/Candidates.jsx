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
    "Verification",
    "Account Status",
    "Registered on",
  ];

  const data = [
    {
      Name: "Aman Garg",
      "Email ID": "aman@gmail.com",
      Phone: "1234567890",
      Verification: "Verified",
      "Account Status": "Active",
      "Registered on": "20-12-2022",
    },
    {
      Name: "Abhya Ram",
      "Email ID": "abhay@gmail.com",
      Phone: "1234567890",
      Verification: "Unverified",
      "Account Status": "Deactivated",
      "Registered on": "16-12-2022",
    },
  ];

  return (
    <>
      <TopNavbar />

      <Container fluid className="mt-4 px-4">

        <BackButton text="Back" />

        <PageTitle title="Users list" />

        {/* TABS */}
        <Tabs tabs={["Candidates", "Employers"]} active="Candidates" />

        {/* STATISTICS ROW */}
        <StatisticsRow stats={stats} />

        {/* FILTER ROW */}
        <Row className="align-items-center g-3 mb-3">
          <Col xs={12} md={3}>
            <ExportButton />
          </Col>

          <Col xs={12} md={4}>
            <SearchInput placeholder="Search..." />
          </Col>

          <Col xs={12} md={3}>
            <FilterDropdown value={filterBy} setValue={setFilterBy} />
          </Col>

          <Col xs={12} md={2}>
            <DateTabs />
          </Col>
        </Row>

        {/* TABLE */}
        <DataTable columns={columns} data={data} />

      </Container>
    </>
  );
};

export default Candidates;
