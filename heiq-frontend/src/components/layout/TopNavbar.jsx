import React from "react";

// NEW LOGO
import Logo from "../../assets/Vector (4).png";

// CUSTOM ICONS
import NotificationIcon from "../../assets/Vector.png";
import DarkModeIcon from "../../assets/Vector (1).png";
import HelpIcon from "../../assets/Vector (2).png";
import LogoutIcon from "../../assets/logout.png";
import MenuIcon from "../../assets/Vector (3).png"; // menu icon

const TopNavbar = ({
  onLogout = () => {},
  onDarkMode = () => {},
  onHelp = () => {},
  onNotifications = () => {},
  onMenuClick = () => {},
}) => {
  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #e6e6e6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        height: "70px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LEFT — NEW LOGO + MENU ICON */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <img src={Logo} alt="logo" style={{ height: "45px", cursor: "pointer" }} />

        {/* Menu Icon */}
        <img
          src={MenuIcon}
          alt="Menu"
          onClick={onMenuClick}
          style={{ width: "22px", height: "22px", cursor: "pointer" }}
        />
      </div>

      {/* RIGHT ICONS */}
      <div style={{ display: "flex", alignItems: "center", gap: "30px", color: "#666" }}>
        
        {/* Notification */}
        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onNotifications}>
          <img src={NotificationIcon} alt="Notification" style={{ width: "20px", height: "20px" }} />
          <div style={{ fontSize: "10px" }}>Notifications</div>
        </div>

        {/* Dark Mode */}
        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onDarkMode}>
          <img src={DarkModeIcon} alt="Dark Mode" style={{ width: "20px", height: "20px" }} />
          <div style={{ fontSize: "10px" }}>Dark Mode</div>
        </div>

        {/* Help */}
        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onHelp}>
          <img src={HelpIcon} alt="Help" style={{ width: "20px", height: "20px" }} />
          <div style={{ fontSize: "10px" }}>Help</div>
        </div>

        {/* Logout */}
        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onLogout}>
          <img src={LogoutIcon} alt="Logout" style={{ width: "20px", height: "20px" }} />
          <div style={{ fontSize: "10px" }}>Logout</div>
        </div>

      </div>
    </div>
  );
};

export default TopNavbar;
