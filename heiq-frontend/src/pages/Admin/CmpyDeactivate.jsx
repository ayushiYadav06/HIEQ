import React, { useState, useEffect } from "react";

import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar";
import BackButton from "../../components/layout/BackButton";
import DataTable from "../../components/ui/DataTable";
import HclLogo from "../../assets/hclcmpy.png";
import ActionButton from "../../components/ui/ActionButton";

const CmpyDeactivate = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ⭐ Responsive left padding logic
  const [leftPad, setLeftPad] = useState(210);

  useEffect(() => {
    const updatePadding = () => {
      const width = window.innerWidth;

      if (width >= 768) {
        // Desktop + Tablet → Sidebar is fixed
        setLeftPad(210);
      } else {
        // Mobile → Offcanvas sidebar
        setLeftPad(0);
      }
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  const columns = ["sno", "user", "reason", "notes", "updatedOn"];

  const rows = [
    {
      sno: 1,
      user: (
        <a
          href="#"
          style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}
        >
          Aman Garg
        </a>
      ),
      reason: "False or insufficient information",
      notes: "Job description is incomplete",
      updatedOn: "14-12-2022",
    },
    {
      sno: 2,
      user: (
        <a
          href="#"
          style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}
        >
          Nived P K
        </a>
      ),
      reason: "False or insufficient information",
      notes: "Job description is incomplete",
      updatedOn: "15-12-2022",
    },
    {
      sno: 3,
      user: (
        <a
          href="#"
          style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}
        >
          Abhiya Ram
        </a>
      ),
      reason: "Unprofessional behaviour",
      notes: "Recruiter was rude",
      updatedOn: "18-12-2022",
    },
    {
      sno: 4,
      user: (
        <a
          href="#"
          style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}
        >
          Irfan Khan
        </a>
      ),
      reason: "False or insufficient information",
      notes: "Job description is incomplete",
      updatedOn: "20-12-2022",
    },
    {
      sno: 5,
      user: (
        <a
          href="#"
          style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}
        >
          Sanchit
        </a>
      ),
      reason: "False or insufficient information",
      notes: "Job description is incomplete",
      updatedOn: "22-12-2022",
    },
    {
      sno: 6,
      user: (
        <a
          href="#"
          style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}
        >
          Meghana
        </a>
      ),
      reason: "Unprofessional behaviour",
      notes: "Recruiter was rude",
      updatedOn: "25-12-2022",
    },
  ];

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* TOP NAVBAR */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* BACK BUTTON (UNTOUCHED) */}
      <div className="container-fluid mt-4 px-2">
        <BackButton label="Back" />
      </div>

      {/* MAIN CONTENT (SHIFTS AFTER SIDEBAR) */}
      <div
        className="container-fluid"
        style={{
          paddingLeft: `${leftPad}px`,
          paddingRight: "20px",
          transition: "all 0.2s ease",
        }}
      >
        <div
          className="p-4 mx-auto"
          style={{
            maxWidth: "1400px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0px 2px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div className="text-center">
            <img
              src={HclLogo}
              alt="Company Logo"
              style={{ width: "190px", marginBottom: "20px" }}
            />
          </div>

          <p className="fw-semibold mt-3 mb-2">Showing 6 out of 15</p>

          {/* TABLE (Responsive scroll on mobile) */}
          <div style={{ overflowX: "auto" }}>
            <DataTable
              columns={columns}
              rows={rows}
              headerBg="#EDEDED"
              headerColor="#333"
            />
          </div>

          <div className="text-center mt-4">
            <ActionButton type="deactivate" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CmpyDeactivate;
