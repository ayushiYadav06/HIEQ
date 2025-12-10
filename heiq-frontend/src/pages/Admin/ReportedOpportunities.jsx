import React, { useState, useEffect } from "react";

import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar";
import BackButton from "../../components/layout/BackButton";

import Tabs from "../../components/ui/Tabs";
import ExportButton from "../../components/ui/ExportButton";
import SearchInput from "../../components/ui/SearchInput";
import FilterDropdown from "../../components/ui/FilterDropdown";
import DateTabs from "../../components/ui/DateTabs";
import DataTable from "../../components/ui/DataTable";
import StatusIcon from "../../components/ui/StatusIcon";

const ReportedOpportunities = () => {
  const [activeTab, setActiveTab] = useState("Jobs");
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("Email ID");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ⭐ Sidebar padding for responsiveness
  const [leftPad, setLeftPad] = useState(210);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 768) {
        // ⭐ Tablet + Laptop + Desktop → Sidebar Fixed → Indent content
        setLeftPad(210);
      } else {
        // ⭐ Mobile → Sidebar Offcanvas → No indentation
        setLeftPad(0);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* TOP NAVBAR */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* BACK BUTTON */}
      <div className="container-fluid mt-4 px-4">
        <BackButton align="left" />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="container-fluid"
        style={{
          paddingLeft: `${leftPad}px`,
          paddingRight: "20px",
          transition: "all 0.2s ease",
        }}
      >
        <div className="px-2 px-md-3">
          <h4 className="fw-bold mt-3">Reported Opportunities</h4>

          <div className="mt-3">
            <Tabs
              active={activeTab}
              setActive={setActiveTab}
              tabs={["Jobs", "Internships"]}
            />
          </div>

          {/* FILTERS */}
          <div className="row g-3 align-items-center mt-4">
            <div className="col-lg-2 col-md-4 col-6">
              <ExportButton />
            </div>

            <div className="col-lg-4 col-md-6 col-6">
              <SearchInput
                placeholder="Enter search here..."
                value={searchValue}
                onChange={(v) => setSearchValue(v)}
              />
            </div>

            <div className="col-lg-3 col-md-4 col-6">
              <FilterDropdown value={filterValue} setValue={setFilterValue} />
            </div>

            <div className="col-lg-3 col-md-6 col-6">
              <DateTabs />
            </div>
          </div>

          {/* TABLE */}
          <div
            className="mt-4"
            style={{
              overflowX: window.innerWidth < 768 ? "auto" : "visible",
            }}
          >
            <DataTable columns={columns} rows={rows} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportedOpportunities;
