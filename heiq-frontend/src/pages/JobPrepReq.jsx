import React, { useState, useRef, useEffect } from "react";

import TopNavbar from "../components/layout/TopNavbar";
import Sidebar from "../components/layout/Sidebar";  // ⭐ ADDED
import BackButton from "../components/layout/BackButton";
import DataTable from "../components/ui/DataTable";

const JobPrepReq = () => {
  // ⭐ SIDEBAR STATE
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const columns = ["sno", "user", "service", "notes", "updatedOn", "menu"];

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rows = [
    {
      sno: 1,
      user: <a href="#" style={{ color: "#333", fontWeight: 600, textDecoration: "none" }}>Aman Garg</a>,
      service: "My Hieq profile",
      notes: "I'm getting rejected.",
      updatedOn: "14-12-2022",
    },
    {
      sno: 2,
      user: <a href="#" style={{ color: "#333", fontWeight: 600, textDecoration: "none" }}>Nived P K</a>,
      service: "My resume",
      notes: "Improve my resume",
      updatedOn: "15-12-2022",
    },
    {
      sno: 3,
      user: <a href="#" style={{ color: "#333", fontWeight: 600, textDecoration: "none" }}>Abhiya Ram</a>,
      service: "Interview prep",
      notes: "I'm getting rejected too many times",
      updatedOn: "18-12-2022",
    },
    {
      sno: 4,
      user: <a href="#" style={{ color: "#333", fontWeight: 600, textDecoration: "none" }}>Irfan Khan</a>,
      service: "LinkedIn optimization",
      notes: "Improve my LinkedIn",
      updatedOn: "20-12-2022",
    },
    {
      sno: 5,
      user: <a href="#" style={{ color: "#333", fontWeight: 600, textDecoration: "none" }}>Sanchit</a>,
      service: "My Hieq profile",
      notes: "Improve my profile",
      updatedOn: "22-12-2022",
    },
    {
      sno: 6,
      user: <a href="#" style={{ color: "#333", fontWeight: 600, textDecoration: "none" }}>Meghana</a>,
      service: "Interview prep",
      notes: "Mock-interview",
      updatedOn: "25-12-2022",
    },
  ];

  const tableRows = rows.map((row, index) => ({
    ...row,
    menu: (
      <div style={{ position: "relative" }} ref={index === openMenuIndex ? menuRef : null}>
        <span
          style={{ fontSize: "22px", cursor: "pointer", padding: "0 6px" }}
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuIndex(openMenuIndex === index ? null : index);
          }}
        >
          ⋮
        </span>

        {openMenuIndex === index && (
          <div
            style={{
              position: "absolute",
              top: "0",
              right: "25px",
              background: "#fff",
              borderRadius: "6px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              padding: "8px 15px",
              width: "180px",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            Mark as read
          </div>
        )}
      </div>
    ),
  }));

  return (
    <>
      {/* ⭐ SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ⭐ TOP NAVBAR */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="container-fluid mt-4">

        <div className="d-flex justify-content-end px-4">
          <BackButton />
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
          <h4 className="fw-bold mb-4" style={{ color: "#333" }}>
            Job prep requests
          </h4>

          <DataTable
            columns={columns}
            rows={tableRows}
            headerBg="#EDEDED"
            headerColor="#333"
          />
        </div>
      </div>
    </>
  );
};

export default JobPrepReq;
