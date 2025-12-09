import React, { useState } from "react";

import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar"; // ⭐ ADDED
import BackButton from "../../components/layout/BackButton";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton";

import HclLogo from "../../assets/hclcmpy.png";

const CmpyActivate = () => {
  // ⭐ SIDEBAR STATE
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const columns = ["sno", "user", "reason", "notes", "updatedOn"];

  // ⭐ NOTES ARE NOW EMPTY
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
      notes: "", // EMPTY
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
      notes: "", // EMPTY
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
      reason: "Unprofessional or unethical behaviour",
      notes: "", // EMPTY
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
      notes: "", // EMPTY
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
      notes: "", // EMPTY
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
      reason: "Unprofessional or unethical behaviour",
      notes: "", // EMPTY
      updatedOn: "25-12-2022",
    },
  ];

  return (
    <>
      {/* ⭐ SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ⭐ TOP NAVBAR WITH MENU CLICK */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="container-fluid mt-4">
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <BackButton label="Back" />
        </div>

        <div
          className="mx-auto mt-3 p-4"
          style={{
            maxWidth: "1500px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0px 2px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Job ID */}
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

          {/* Count */}
          <p className="mt-4 mb-2 fw-semibold">Showing 6 out of 15</p>

          {/* TABLE */}
          <DataTable
            columns={columns}
            rows={rows}
            headerBg="#EDEDED"
            headerColor="#333"
          />

          {/* ACTIVATE BUTTON */}
          <div className="text-center mt-4 mb-2">
            <ActionButton type="activate" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CmpyActivate;
