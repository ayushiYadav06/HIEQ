import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaStar,
  FaPlus,
  FaFileAlt,
  FaLock,
  FaQuestionCircle,
  FaUsers,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdReportProblem } from "react-icons/md"; 
import { FaUserShield, FaUserCheck } from "react-icons/fa"; 
import { MdOutlineRequestPage } from "react-icons/md";

const NAVBAR_HEIGHT = 70;

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* ⭐ MOBILE SIDEBAR */}
      <div
        className={`offcanvas offcanvas-start d-md-none ${isOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{ width: "200px" }}
      >
        <div className="offcanvas-header border-bottom">
          <button className="btn-close ms-auto" onClick={onClose}></button>
        </div>

        <div className="offcanvas-body px-3">
          <SidebarMenu onNavigate={handleNavigation} />
        </div>
      </div>

      {/* ⭐ DESKTOP SIDEBAR */}
      <div
        className="d-none d-md-flex flex-column bg-white border-end shadow-sm"
        style={{
          width: "210px",
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          position: "fixed",
          left: 0,
          top: NAVBAR_HEIGHT,
          zIndex: 1030,
        }}
      >
        <div className="px-3 pt-2">
          <SidebarMenu onNavigate={handleNavigation} />
        </div>
      </div>
    </>
  );
};

/* ⭐ Sidebar Menu */
const SidebarMenu = ({ onNavigate }) => (
  <ul className="list-unstyled m-0 p-0">
    <SidebarItem
      icon={<FaHome />}
      label="Dashboard"
      onClick={() => onNavigate("/admin/dashboard")}
    />

    <SidebarItem
      icon={<FaUsers />}
      label="User Management"
      onClick={() => onNavigate("/admin/candidates")}
    />


    <SidebarItem
      icon={<MdOutlineRequestPage />}
      label="Job Prep Requests"
      onClick={() => onNavigate("/admin/job-prep-requests")}
    />

    <SidebarItem
      icon={<FaUsers />}
      label="Candidates"
      onClick={() => onNavigate("/admin/dash")}
    />

    <SidebarItem
      icon={<MdReportProblem />}
      label="Reported Opportunities"
      onClick={() => onNavigate("/admin/reported-opportunities")}
    />

    <SidebarItem
      icon={<FaUserShield />}
      label="Company Deactivate"
      onClick={() => onNavigate("/admin/company-deactivate")}
    />

    <SidebarItem
      icon={<FaUserCheck />}
      label="Company Activate"
      onClick={() => onNavigate("/admin/company-activate")}
    />

    <SidebarItem
      icon={<FaLock />}
      label="Change Password"
      onClick={() => onNavigate("/Account-Setting")}
    />
  </ul>
);

/* ⭐ Sidebar item */
const SidebarItem = ({ icon, label, onClick }) => (
  <li
    onClick={onClick}
    className="d-flex align-items-center gap-2 py-3"
    style={{
      cursor: "pointer",
      color: "#555",
      fontSize: "15px",
      borderBottom: "1px solid #f3f3f3",
    }}
  >
    <span style={{ fontSize: "18px", color: "#888" }}>{icon}</span>
    <span>{label}</span>
  </li>
);

export default Sidebar;