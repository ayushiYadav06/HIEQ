import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Layout Components
import TopNavbar from "../components/layout/TopNavbar";
import BackButton from "../components/layout/BackButton";
import ProfileMiniNavbar from "../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../components/layout/ProfileCenterBox";

// UI Components
import Tabs from "../components/ui/Tabs";
import SearchInput from "../components/ui/SearchInput";
import AllJobsButton from "../components/ui/AllJobsButton";
import DateTabs from "../components/ui/DateTabs";
import StatBox from "../components/ui/StatBox";
import DataTable from "../components/ui/DataTable";
import CardContainer from "../components/ui/CardContainer";

// Theme
import { colors } from "../theme/colors";

const AdminDash = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Jobs");
  const [dateValue, setDateValue] = useState(new Date());

  // TABLE HEADERS
  const columns = ["Job Title", "Company", "Status", "Applied On"];

  // YOUR EXACT DATA FROM SCREENSHOT
  const rows = [
    { title: "UX/UI Designer", company: "MBAtrek Pvt. Ltd.", status: "Awaiting", date: "20-12-2022" },
    { title: "Product Manager", company: "YoCreativ Pvt. Ltd.", status: "Rejected", date: "20-12-2022" },
    { title: "UX Researcher", company: "Heiq", status: "Shortlisted : Assessment", date: "16-12-2022" },
    { title: "Product Designer", company: "MBAtrek Pvt. Ltd.", status: "Shortlisted : HR Interview", date: "15-12-2022" },
    { title: "UX/UI Designer", company: "Bloombloom Pvt. Ltd.", status: "Selected", date: "14-12-2022" },
    { title: "HTML Developer", company: "Blissclub", status: "Shortlisted : Assessment", date: "14-12-2022" },
  ];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f7f7f7" }}>

      {/* TOP NAVBAR */}
      <TopNavbar />

      {/* BACK BUTTON */}
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", paddingRight: "1.5rem" }}>
        <BackButton label="Back" />
      </div>

      {/* MINI NAVBAR + PROFILE CENTER BOX */}
      <div style={{ position: "relative", marginTop: "1rem", paddingBottom: "120px" }}>
        <ProfileMiniNavbar
          email="admin@heiq.com"
          phone="9876543210"
          joinedDate="1st Jan 2022"
          lastSeen="Active now"
        />

        {/* Floating Center Profile Box */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: "-25px",
          }}
        >
          <ProfileCenterBox
            profileImage="https://i.pravatar.cc/150?img=12"
            name="Shrikant"
            hideButton={false}
            onViewProfile={() => navigate("/profile")}
          />
        </div>
      </div>

      {/* FULL WIDTH + RESPONSIVE PAGE CONTENT */}
      <div
        style={{
          width: "100%",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          marginTop: "7rem",
          display: "block",
        }}
      >
        <CardContainer>

          {/* TABS */}
          <Tabs active={active} setActive={setActive} tabs={["Jobs", "Internships"]} />

          {/* ---------------- SEARCH + FILTERS ROW ---------------- */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              marginTop: "20px",
              width: "100%",
            }}
          >
            {/* SEARCH */}
            <div style={{ flex: "1 1 280px" }}>
              <SearchInput placeholder="Search here..." />
            </div>

            {/* ALL JOBS */}
            <div style={{ flex: "1 1 200px" }}>
              <AllJobsButton value="All Jobs" />
            </div>

            {/* DATE */}
            <div style={{ flex: "1 1 200px" }}>
              <DateTabs selected={dateValue} onChange={setDateValue} />
            </div>
          </div>

          {/* ---------------- STATISTICS ROW ---------------- */}
          <div
            style={{
              marginTop: "25px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "20px",
              background: "#fff",
              padding: "20px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              width: "100%",
            }}
          >
            <StatBox label="Applied" value="32" color={colors.textDark} />
            <StatBox label="Awaiting" value="15" color={colors.awaiting} />
            <StatBox label="In Progress" value="05" color={colors.inProgress} />
            <StatBox label="Selected" value="05" color={colors.selected} />
            <StatBox label="Withdrawn" value="05" color={colors.withdrawn} />
            <StatBox label="Rejected" value="07" color={colors.rejected} />
          </div>

          {/* ---------------- RESPONSIVE TABLE ---------------- */}
          <div style={{ overflowX: "auto", marginTop: "20px", width: "100%" }}>
            <DataTable columns={columns} rows={rows} />
          </div>

        </CardContainer>
      </div>
    </div>
  );
};

export default AdminDash;
