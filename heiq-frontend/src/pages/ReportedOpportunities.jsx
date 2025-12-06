import React, { useState } from "react";

import TopNavbar from "../components/layout/TopNavbar";
import Sidebar from "../components/layout/Sidebar";   // ⭐ ADDED
import BackButton from "../components/layout/BackButton";

import Tabs from "../components/ui/Tabs";
import ExportButton from "../components/ui/ExportButton";
import SearchInput from "../components/ui/SearchInput";
import FilterDropdown from "../components/ui/FilterDropdown";
import DateTabs from "../components/ui/DateTabs";
import DataTable from "../components/ui/DataTable";
import StatusIcon from "../components/ui/StatusIcon";

const ReportedOpportunities = () => {
  const [activeTab, setActiveTab] = useState("Jobs");
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("Email ID");

  // ⭐ SIDEBAR STATE
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const columns = [
    "sno",
    "jobId",
    "jobTitle",
    "company",
    "status",
    "frequency",
    "action",
  ];

  const rows = [
    {
      sno: 1,
      jobId: "J000000001",
      jobTitle: "UX/UI Designer",
      company: "MBAtrek Pvt. Ltd.",
      status: <StatusIcon status="Active" />,
      frequency: 10,
      action: "Deactivate",
    },
    {
      sno: 2,
      jobId: "J000000002",
      jobTitle: "Product Manager",
      company: "YoCreativ Pvt. Ltd.",
      status: <StatusIcon status="Active" />,
      frequency: 12,
      action: "Deactivate",
    },
    {
      sno: 3,
      jobId: "J000000003",
      jobTitle: "UX Researcher",
      company: "Heiq",
      status: <StatusIcon status="Active" />,
      frequency: 16,
      action: "Deactivate",
    },
    {
      sno: 4,
      jobId: "J000000004",
      jobTitle: "Product Designer",
      company: "MBAtrek Pvt. Ltd.",
      status: <StatusIcon status="Inactive" />,
      frequency: 18,
      action: "Activate",
    },
    {
      sno: 5,
      jobId: "J000000005",
      jobTitle: "UX/UI Designer",
      company: "Bloombloom Pvt. Ltd.",
      status: <StatusIcon status="Inactive" />,
      frequency: 36,
      action: "Activate",
    },
    {
      sno: 6,
      jobId: "J000000006",
      jobTitle: "HTML Developer",
      company: "Blissclub",
      status: <StatusIcon status="Active" />,
      frequency: 8,
      action: "Deactivate",
    },
  ];

  return (
    <>
      {/* ⭐ SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ⭐ TOP NAVBAR WITH MENU ICON */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="container-fluid mt-4 px-4">
        <BackButton align="right" />

        <h4 className="fw-bold mt-3">Reported Opportunities</h4>

        <div className="mt-3">
          <Tabs
            active={activeTab}
            setActive={setActiveTab}
            tabs={["Jobs", "Internships"]}
          />
        </div>

        <div className="row g-3 align-items-center mt-4">
          <div className="col-md-2 col-6">
            <ExportButton />
          </div>

          <div className="col-md-4 col-6">
            <SearchInput
              placeholder="Enter search here..."
              value={searchValue}
              onChange={(v) => setSearchValue(v)}
            />
          </div>

          <div className="col-md-3 col-6">
            <FilterDropdown value={filterValue} setValue={setFilterValue} />
          </div>

          <div className="col-md-3 col-6">
            <DateTabs />
          </div>
        </div>

        <div className="mt-4">
          <DataTable columns={columns} rows={rows} />
        </div>
      </div>
    </>
  );
};

export default ReportedOpportunities;
