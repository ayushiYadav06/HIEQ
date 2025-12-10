import React, { useState, useEffect } from "react";

import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar";
import BackButton from "../../components/layout/BackButton";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton";

import HclLogo from "../../assets/hclcmpy.png";

const CmpyActivate = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ⭐ LEFT PADDING (responsive sidebar)
  const [leftPad, setLeftPad] = useState(210);

  useEffect(() => {
    const adjustPadding = () => {
      const width = window.innerWidth;

      if (width >= 768) {
        // Tablet, laptop, desktop → sidebar fixed → add padding
        setLeftPad(210);
      } else {
        // Mobile → offcanvas → no sidebar padding
        setLeftPad(0);
      }
    };

    adjustPadding();
    window.addEventListener("resize", adjustPadding);
    return () => window.removeEventListener("resize", adjustPadding);
  }, []);

  const columns = ["sno", "user", "reason", "notes", "updatedOn"];

  const rows = [
    {
      sno: 1,
      user: <a href="#" style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}>Aman Garg</a>,
      reason: "False or insufficient information",
      notes: "",
      updatedOn: "14-12-2022",
    },
    {
      sno: 2,
      user: <a href="#" style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}>Nived P K</a>,
      reason: "False or insufficient information",
      notes: "",
      updatedOn: "15-12-2022",
    },
    {
      sno: 3,
      user: <a href="#" style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}>Abhiya Ram</a>,
      reason: "Unprofessional or unethical behaviour",
      notes: "",
      updatedOn: "18-12-2022",
    },
    {
      sno: 4,
      user: <a href="#" style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}>Irfan Khan</a>,
      reason: "False or insufficient information",
      notes: "",
      updatedOn: "20-12-2022",
    },
    {
      sno: 5,
      user: <a href="#" style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}>Sanchit</a>,
      reason: "False or insufficient information",
      notes: "",
      updatedOn: "22-12-2022",
    },
    {
      sno: 6,
      user: <a href="#" style={{ color: "#333", textDecoration: "none", fontWeight: 600 }}>Meghana</a>,
      reason: "Unprofessional behaviour",
      notes: "",
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
      <div className="container-fluid mt-4 px-4">
        <BackButton label="Back" />
      </div>

      {/* MAIN CONTENT (SHIFTS AFTER SIDEBAR) */}
      <div
        className="container-fluid"
        style={{
          paddingLeft: `${leftPad}px`,
          paddingRight: "20px",
          transition: "all 0.2s ease",
          marginTop: "10px",
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
          {/* JOB ID */}
          <p className="fw-semibold" style={{ color: "#666" }}>
            Job ID: J0000000001
          </p>

          {/* LOGO */}
          <div className="text-center mt-2">
            <img
              src={HclLogo}
              alt="HCL Logo"
              style={{ width: "150px", marginBottom: "20px" }}
            />
          </div>

          {/* COUNT */}
          <p className="mt-4 mb-2 fw-semibold">Showing 6 out of 15</p>

          {/* TABLE (responsive scroll on mobile) */}
          <div style={{ overflowX: "auto" }}>
            <DataTable
              columns={columns}
              rows={rows}
              headerBg="#EDEDED"
              headerColor="#333"
            />
          </div>

          {/* ACTIVATE BUTTON */}
          <div className="text-center mt-4 mb-3">
            <ActionButton type="activate" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CmpyActivate;
