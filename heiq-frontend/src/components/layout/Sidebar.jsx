import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // ⭐ REUSABLE HANDLER
  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // close sidebar after clicking
  };

  return (
    <>
      {/* DARK OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 998,
          }}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? "0" : "-260px",
          width: "260px",
          height: "100vh",
          background: "#fff",
          boxShadow: "2px 0px 8px rgba(0,0,0,0.15)",
          padding: "20px",
          transition: "left 0.3s ease",
          zIndex: 999,
        }}
      >
        {/* CLOSE BUTTON */}
        <div
          onClick={onClose}
          style={{
            textAlign: "right",
            cursor: "pointer",
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          ✕
        </div>

        {/* MENU ITEMS */}
        <ul style={{ listStyle: "none", padding: 0 }}>

          <li style={menuItem} onClick={() => handleNavigation("/")}>
            Dashboard
          </li>

          <li style={menuItem} onClick={() => handleNavigation("/job-prep-requests")}>
            Job Prep Requests
          </li>

          <li style={menuItem} onClick={() => handleNavigation("/admin/candidates")}>
            Candidates
          </li>

          <li style={menuItem} onClick={() => handleNavigation("/reported-opportunities")}>
            Reported Opportunities
          </li>

          <li style={menuItem} onClick={() => handleNavigation("/Account-Setting")}>
            Account Settings
          </li>

          <li style={menuItem} onClick={() => handleNavigation("/company-deactivate")}>
            Company Deactivate
          </li>

          <li style={menuItem} onClick={() => handleNavigation("/company/activate")}>
            Company Activate
          </li>

          <li style={menuItem} onClick={() => handleNavigation("/Verify-Documents")}>
            Verify Documents
          </li>

          <li style={menuItem} onClick={() => handleNavigation("/profile")}>
            User Profile
          </li>

        </ul>
      </div>
    </>
  );
};

const menuItem = {
  padding: "12px 0",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
  fontSize: "15px",
  color: "#333",
};

export default Sidebar;
