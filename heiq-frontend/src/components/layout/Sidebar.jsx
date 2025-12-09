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

const NAVBAR_HEIGHT = 70; // Keep sidebar aligned with navbar

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
        className={`offcanvas offcanvas-start d-md-none ${
          isOpen ? "show" : ""
        }`}
        tabIndex="-1"
        style={{ width: "200px" }}
      >
        {/* Header Removed */}
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
        {/* Sidebar Header Removed */}
        {/* Empty spacing removed completely */}

        {/* MENU ITEMS */}
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
      onClick={() => onNavigate("/")}
    />
    <SidebarItem
      icon={<FiSearch />}
      label="Search jobs, internships"
      onClick={() => onNavigate("/search")}
    />
    <SidebarItem icon={<FaStar />} label="Saved Opportunities" />
    <SidebarItem icon={<FaPlus />} label="Badges" />
    <SidebarItem icon={<FaFileAlt />} label="My Resumes" />
    <SidebarItem
      icon={<FaLock />}
      label="Change Password"
      onClick={() => onNavigate("/Account-Setting")}
    />
    <SidebarItem icon={<FaQuestionCircle />} label="Help" />
  </ul>
);

/* ⭐ Sidebar item with 10px border */
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
