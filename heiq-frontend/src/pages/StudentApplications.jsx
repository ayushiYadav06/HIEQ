import React, { useState } from "react";

// Reusable Components
import TopNavbar from "../components/Layout/TopNavbar";
import ProfileMiniNavbar from "../components/Layout/ProfileMiniNavbar";
import ProfileCenterBox from "../components/Layout/ProfileCenterBox";
import Tabs from "../components/ui/Tabs.jsx";
import CardContainer from "../components/ui/CardContainer";
import StatBox from "../components/ui/StatBox";
import StatusBadge from "../components/ui/StatusBadge";
import BackButton from "../components/Layout/BackButton";
import AllJobsButton from "../components/ui/AllJobsButton";

// Theme
import { colors } from "../theme/colors";

// responsive css
import "../styles/responsive.css";

// ICON IMPORTS
import SearchIcon from "../assets/vector (5).png";
import CalendarIcon from "../assets/clarity_date-line.svg";

const StudentApplications = () => {
  const [active, setActive] = useState("Jobs");

  const rows = [
    { title: "UX/UI Designer", company: "MBAtrek Pvt. Ltd.", status: "Awaiting", date: "20-12-2022" },
    { title: "Product Manager", company: "YoCreativ Pvt. Ltd.", status: "Rejected", date: "20-12-2022" },
    { title: "UX Researcher", company: "Heiq", status: "In Progress", date: "16-12-2022" },
    { title: "Product Designer", company: "MBAtrek Pvt. Ltd.", status: "Selected", date: "15-12-2022" },
  ];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f7f7f7" }}>
      
      {/* TOP NAVBAR */}
      <TopNavbar />

      {/* BACK BUTTON */}
      <div
        style={{
          marginTop: "12px",
          paddingRight: "50px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <BackButton label="Back" />
      </div>

      {/* PROFILE MINI NAVBAR */}
      <div style={{ position: "relative", marginTop: "12px" }}>
        <div className="sa-mini-navbar">
          <ProfileMiniNavbar
            email="nivedp@gmail.com"
            phone="1234567890"
            joinedDate="20th May 2023"
            lastSeen="25 mins ago"
          />
        </div>

        {/* PROFILE CARD */}
        <div
          className="sa-profile-card"
          style={{
            position: "absolute",
            top: "-20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
            <ProfileCenterBox
              profileImage="https://i.pravatar.cc/150?img=8"
              name="NIVED P K"
              onViewProfile={() => alert("View Profile Clicked")}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className="sa-wrapper" style={{ width: "100%", padding: "40px 20px", marginTop: "170px" }}>
        <CardContainer style={{ width: "100%", maxWidth: "100%" }}>
          
          {/* TABS */}
          <Tabs active={active} setActive={setActive} />

          {/* ------------------ SEARCH + FILTERS ------------------ */}
          <div
            className="sa-filters"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "50px",
              marginTop: "20px",
              alignItems: "center",
              maxWidth: "100%",
            }}
          >
            {/* SEARCH BAR */}
            <div
              style={{
                width: "501px",
                height: "35px",
                border: "1px solid #999999",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                color: "#666666",
                flexShrink: 0,
                gap: "10px",
              }}
            >
              <img
                src={SearchIcon}
                alt="search"
                style={{
                  width: "18px",
                  height: "18px",
                  objectFit: "contain",
                  opacity: 0.8,
                }}
              />
              <input
                placeholder="Enter search here..."
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  color: "#666",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* ALL JOBS DROPDOWN */}
            <div style={{ flexShrink: 0 }}>
              <AllJobsButton />
            </div>

            {/* DATE RANGE */}
            <div
              style={{
                width: "501px",
                height: "35px",
                border: "1px solid #999999",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                color: "#999999",
                gap: "10px",
                flexShrink: 0,
              }}
            >
              <img
                src={CalendarIcon}
                alt="calendar"
                style={{
                  width: "18px",
                  height: "18px",
                  objectFit: "contain",
                }}
              />
              <span>31 Dec 2021 - 15 Jan 2022</span>
            </div>
          </div>

          {/* ------------------ STATS BOX ------------------ */}
          <div
            style={{
              width: "100%",
              height: "98px",
              background: "#FFFFFF",
              border: "1px solid #DDDDDD",
              borderRadius: "4px",
              marginTop: "30px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <StatBox label="Applied" value="32" color={colors.textDark} />
            <StatBox label="Awaiting" value="15" color={colors.awaiting} />
            <StatBox label="In Progress" value="05" color={colors.inProgress} />
            <StatBox label="Selected" value="05" color={colors.selected} />
            <StatBox label="Withdrawn" value="05" color={colors.withdrawn} />
            <StatBox label="Rejected" value="07" color={colors.rejected} />
          </div>

          {/* ------------------ FULL SCREEN TABLE ------------------ */}
          <div className="sa-table-wrapper" style={{ width: "100%", overflowX: "auto" }}>
            <div
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: "1px solid #DDDDDD",
                borderRadius: "4px",
                marginTop: "30px",
                padding: "15px",
              }}
            >
              {/* TABLE HEADER */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr",
                  padding: "12px 20px",
                  fontWeight: "600",
                  color: "#777",
                  fontSize: "14px",
                  borderBottom: "1px solid #DDD",
                }}
              >
                <div style={{ borderRight: "1px solid #DDD" }}>Job Title</div>
                <div style={{ borderRight: "1px solid #DDD", paddingLeft: "20px" }}>Company</div>
                <div style={{ borderRight: "1px solid #DDD", paddingLeft: "20px" }}>Status</div>
                <div style={{ paddingLeft: "20px" }}>Applied on</div>
              </div>

              {/* TABLE ROWS */}
              {rows.map((r, index) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr",
                    padding: "14px 20px",
                    fontSize: "14px",
                    alignItems: "center",
                    borderBottom: "1px solid #DDD",
                  }}
                >
                  <div style={{ borderRight: "1px solid #DDD" }}>{r.title}</div>
                  <div style={{ paddingLeft: "20px", borderRight: "1px solid #DDD" }}>{r.company}</div>
                  <div style={{ paddingLeft: "20px", borderRight: "1px solid #DDD" }}>
                    <StatusBadge status={r.status} />
                  </div>
                  <div style={{ paddingLeft: "20px" }}>{r.date}</div>
                </div>
              ))}
            </div>
          </div>

        </CardContainer>
      </div>
    </div>
  );
};

export default StudentApplications;
