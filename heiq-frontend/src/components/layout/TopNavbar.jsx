import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logoutUser } from "../../store/slices/authSlice";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import LogoutModal from "./Logout/LogoutModal";

// CUSTOM ICONS
import NotificationIcon from "../../assets/Vector.png";
import DarkModeIcon from "../../assets/Vector (1).png";
import HelpIcon from "../../assets/Vector (2).png";
import LogoutIcon from "../../assets/logout.png";
import Logo from "../../assets/hieqLogo.png";

const TopNavbar = ({
  onHelp = () => {},
  onNotifications = () => {},
  onMenuClick = () => {},
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme, isDark } = useTheme();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const themeColors = isDark ? colors.dark : colors.light;

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
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

  const onDarkMode = () => {
    toggleTheme();
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          background: themeColors.surface,
          borderBottom: `1px solid ${themeColors.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          height: "70px",
          position: "sticky",
          top: 0,
          zIndex: 90,
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* ⭐ LOGO ON LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Mobile Menu Button */}
          <button
            className="d-md-none btn"
            onClick={onMenuClick}
            style={{
              border: "none",
              background: "transparent",
              padding: "8px",
              cursor: "pointer",
              color: themeColors.text,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <img
            src={Logo}
            alt="HieQ Logo"
            style={{ height: "45px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </div>

        {/* ⭐ RIGHT SIDE ICONS */}
        <div style={{ display: "flex", alignItems: "center", gap: "30px", color: themeColors.textSecondary }}>
          
          <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onNotifications}>
            <img src={NotificationIcon} alt="Notification" style={{ width: "20px", height: "20px" }} />
            <div style={{ fontSize: "10px" }}>Notifications</div>
          </div>

          <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onDarkMode}>
            <img src={DarkModeIcon} alt="Dark Mode" style={{ width: "20px", height: "20px" }} />
            <div style={{ fontSize: "10px" }}>{isDark ? "Light Mode" : "Dark Mode"}</div>
          </div>

          <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onHelp}>
            <img src={HelpIcon} alt="Help" style={{ width: "20px", height: "20px" }} />
            <div style={{ fontSize: "10px" }}>Help</div>
          </div>

          <div
            style={{
              textAlign: "center",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
            }}
            onClick={handleLogout}
          >
            <img src={LogoutIcon} alt="Logout" style={{ width: "20px", height: "20px" }} />
            <div style={{ fontSize: "10px" }}>{isLoading ? "Logging out..." : "Logout"}</div>
          </div>

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

export default TopNavbar;
