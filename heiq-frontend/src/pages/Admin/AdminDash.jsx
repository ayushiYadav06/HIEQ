import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Layout Components
import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar";
import BackButton from "../../components/layout/BackButton";
import ProfileMiniNavbar from "../../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../../components/layout/ProfileCenterBox";

// UI Components
import Tabs from "../../components/ui/Tabs";
import SearchInput from "../../components/ui/SearchInput";
import AllJobsButton from "../../components/ui/AllJobsButton";
import DateTabs from "../../components/ui/DateTabs";
import StatBox from "../../components/ui/StatBox";
import DataTable from "../../components/ui/DataTable";
import CardContainer from "../../components/ui/CardContainer";

// Theme
import { colors } from "../../theme/colors";

const AdminDash = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Jobs");
  const [dateValue, setDateValue] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const columns = ["Job Title", "Company", "Status", "Applied On"];

  const rows = [
    {
      "Job Title": "UX/UI Designer",
      Company: "MBAtrek Pvt. Ltd.",
      Status: <span className="text-warning fw-semibold">Awaiting</span>,
      "Applied On": "20-12-2022",
    },
    {
      "Job Title": "Product Manager",
      Company: "YoCreativ Pvt. Ltd.",
      Status: <span className="text-danger fw-semibold">Rejected</span>,
      "Applied On": "20-12-2022",
    },
    {
      "Job Title": "UX Researcher",
      Company: "Heiq",
      Status: (
        <span className="text-primary fw-semibold">
          Shortlisted : Assessment
        </span>
      ),
      "Applied On": "16-12-2022",
    },
    {
      "Job Title": "Product Designer",
      Company: "MBAtrek Pvt. Ltd.",
      Status: (
        <span className="text-primary fw-semibold">
          Shortlisted : HR Interview
        </span>
      ),
      "Applied On": "15-12-2022",
    },
    {
      "Job Title": "UX/UI Designer",
      Company: "Bloombloom Pvt. Ltd.",
      Status: <span className="text-success fw-semibold">Selected</span>,
      "Applied On": "14-12-2022",
    },
    {
      "Job Title": "HTML Developer",
      Company: "Blissclub",
      Status: (
        <span className="text-primary fw-semibold">
          Shortlisted : Assessment
        </span>
      ),
      "Applied On": "14-12-2022",
    },
  ];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f7f7f7" }}>
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* TOP NAVBAR */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* BACK BUTTON */}
      <div style={{ marginTop: "1rem" }}>
        <BackButton label="Back" />
      </div>

      {/* MINI NAVBAR + PROFILE BOX */}
      <div
        style={{
          position: "relative",
          marginTop: "1rem",
          paddingBottom: "120px",
        }}
      >
        <ProfileMiniNavbar
          email="admin@heiq.com"
          phone="9876543210"
          joinedDate="1st Jan 2022"
          lastSeen="Active now"
        />

        <div
          style={{
            position: "absolute",
            left: "calc(210px + 40%)",
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

      {/* PAGE CONTENT */}
      <div
        style={{
          width: "100%",
          paddingRight: "5px",
          paddingLeft: "210px",
          marginTop: "7rem",
        }}
      >
        <CardContainer
          style={{
            width: "100%",
            maxWidth: "110%",
            padding: "10px 20px",
            marginLeft: "0",
            boxSizing: "border-box",
          }}
        >
          <Tabs
            active={active}
            setActive={setActive}
            tabs={["Jobs", "Internships"]}
          />

          {/* FILTER BAR */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
              width: "100%",
            }}
          >
            <div style={{ width: "450px", marginRight: "1px" }}>
              <SearchInput placeholder="Search here..." />
            </div>

            <div style={{ width: "350px" }}>
              <AllJobsButton value="All Jobs" />
            </div>

            <div style={{ width: "450px" }}>
              <DateTabs selected={dateValue} onChange={setDateValue} />
            </div>
          </div>

          {/* STATS */}
          <div
            style={{
              marginTop: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              background: "#fff",
              padding: "25px",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
          >
            <div style={{ flex: 1 }}>
              <StatBox label="Applied" value="32" color={colors.textDark} />
            </div>
            <div style={{ flex: 1 }}>
              <StatBox label="Awaiting" value="15" color={colors.awaiting} />
            </div>
            <div style={{ flex: 1 }}>
              <StatBox
                label="In Progress"
                value="05"
                color={colors.inProgress}
              />
            </div>
            <div style={{ flex: 1 }}>
              <StatBox label="Selected" value="05" color={colors.selected} />
            </div>
            <div style={{ flex: 1 }}>
              <StatBox label="Withdrawn" value="05" color={colors.withdrawn} />
            </div>
            <div style={{ flex: 1 }}>
              <StatBox label="Rejected" value="07" color={colors.rejected} />
            </div>
          </div>

          {/* TABLE */}
          <div
            style={{
              overflowX: "auto",
              marginTop: "20px",
              width: "100%",
              paddingRight: "1px",
            }}
          >
            <DataTable columns={columns} rows={rows} />
          </div>
        </CardContainer>
      </div>
    </div>
  );
};

export default AdminDash;
