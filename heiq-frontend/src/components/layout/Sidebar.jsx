import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux";
import { logoutUser } from "../../store/slices/authSlice";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaHome,
  FaLock,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";
import { MdReportProblem } from "react-icons/md"; 
import { FaUserShield, FaUserCheck } from "react-icons/fa";
import { colors } from "../../theme/colors";
import LogoutModal from "./Logout/LogoutModal";

const NAVBAR_HEIGHT = 70;

// Menu items configuration
const menuItems = [
  {
    icon: FaHome,
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: FaUsers,
    label: "User Management",
    path: "/admin/candidates",
  },
  {
    icon: FaClipboardList,
    label: "Assessment",
    path: "/admin/assessment",
  },
  {
    icon: FaUsers,
    label: "List Management",
    path: "/",
  },
  {
    icon: MdReportProblem,
    label: "Content Management",
    path: "/reported-opportunities",
  },
  {
    icon: FaUserShield,
    label: "Support",
    path: "/company-deactivate",
  },
  {
    icon: FaUserCheck,
    label: "Analytics",
    path: "/company/activate",
  },
  {
    icon: FaLock,
    label: "Ticket",
    path: "/Account-Setting",
  },
  {
    icon: FaLock,
    label: "Settings",
    path: "/Account-Seing",
  },
  {
    icon: FaLock,
    label: "Logout",
    path: "",
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const themeColors = isDark ? colors.dark : colors.light;

  const handleNavigation = (path, isLogout = false) => {
    if (isLogout) {
      setIsLogoutModalOpen(true);
      return;
    }
    if (path) {
      navigate(path);
      onClose();
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login", { replace: true });
    }
    setIsLogoutModalOpen(false);
  };

  const handleLogoutModalClose = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* ⭐ MOBILE SIDEBAR */}
      <div
        className={`offcanvas offcanvas-start d-md-none ${
          isOpen ? "show" : ""
        }`}
        tabIndex="-1"
        style={{
          width: "200px",
          backgroundColor: themeColors.surface,
          color: themeColors.text,
        }}
      >
        <div
          className="offcanvas-header border-bottom"
          style={{
            borderBottomColor: themeColors.border,
          }}
        >
          <button className="btn-close ms-auto" onClick={onClose}></button>
        </div>

        <div className="offcanvas-body px-3" style={{ overflowY: "auto" }}>
          <SidebarMenu
            onNavigate={handleNavigation}
            currentPath={location.pathname}
          />
        </div>
      </div>

      {/* ⭐ DESKTOP SIDEBAR */}
      <div
        className="d-none d-md-flex flex-column border-end shadow-sm"
        style={{
          width: "210px",
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          position: "fixed",
          left: 0,
          top: NAVBAR_HEIGHT,
          zIndex: 1030,
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          className=""
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            height: "100%",
          }}
        >
          <SidebarMenu
            onNavigate={handleNavigation}
            currentPath={location.pathname}
          />
        </div>
      </div>

      {/* ⭐ LOGOUT MODAL */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutModalClose}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

/* ⭐ Sidebar Menu */
const SidebarMenu = ({ onNavigate, currentPath }) => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  return (
    <ul className="list-unstyled m-0 p-0">
      {menuItems.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = currentPath === item.path;
        const isLogout = item.label === "Logout";

        return (
          <SidebarItem
            key={index}
            icon={<IconComponent />}
            label={item.label}
            isActive={isActive}
            themeColors={themeColors}
            onClick={() => onNavigate(item.path, isLogout)}
          />
        );
      })}
    </ul>
  );
};

/* ⭐ Sidebar item */
const SidebarItem = ({ icon, label, isActive, themeColors, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getBackgroundColor = () => {
    if (isActive) {
      return colors.primaryGreen;
    }
    if (isHovered) {
      return themeColors.border;
    }
    return "transparent";
  };

  const getTextColor = () => {
    return isActive ? "#ffffff" : themeColors.text;
  };

  const getIconColor = () => {
    return isActive ? "#ffffff" : themeColors.textSecondary;
  };

  return (
    <li
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="d-flex align-items-center gap-2 py-3 px-2"
      style={{
        cursor: "pointer",
        color: getTextColor(),
        fontSize: "15px",
        borderBottom: `1px solid ${themeColors.border}`,
        backgroundColor: getBackgroundColor(),
        marginBottom: "2px",
        transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
      }}
    >
      <span
        style={{
          fontSize: "18px",
          color: getIconColor(),
          display: "flex",
          alignItems: "center",
          transition: "color 0.2s ease",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontWeight: isActive ? 600 : 400,
          display: "flex",
          alignItems: "center",
        }}
      >
        {label}
      </span>
    </li>
  );
};

export default Sidebar;