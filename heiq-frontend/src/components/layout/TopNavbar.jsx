import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logoutUser } from "../../store/slices/authSlice";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import LogoutModal from "./Logout/LogoutModal";

import NotificationIcon from "../../assets/Vector.png";
import DarkModeIcon from "../../assets/Vector (1).png";
import HelpIcon from "../../assets/Vector (2).png";
import LogoutIcon from "../../assets/logout.png";
import Logo from "../../assets/hieqLogo.png";

const TopNavbar = ({
  onHelp = () => {},
  onNotifications = () => {},
  onMenuClick = () => {},
  hideLogout = false,
  minimal = false, // ⭐ NEW PROP — login page uses this
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const { isDark, toggleTheme } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => setIsLogoutModalOpen(true);

  const handleLogoutConfirm = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
    setIsLogoutModalOpen(false);
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
        }}
      >
        {/* LEFT LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            className="d-md-none btn"
            onClick={onMenuClick}
            style={{
              border: "none",
              background: "transparent",
              color: themeColors.text,
            }}
          >
            <svg width="24" height="24" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <img
            src={Logo}
            alt="HieQ Logo"
            style={{ height: "65px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </div>

        {/* ⭐ RIGHT ICONS — HIDDEN COMPLETELY IN MINIMAL MODE */}
        {!minimal && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
              color: themeColors.textSecondary,
            }}
          >
            {/* Notifications */}
            <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onNotifications}>
              <img src={NotificationIcon} alt="Notification" style={{ width: "20px" }} />
              <div style={{ fontSize: "10px" }}>Notifications</div>
            </div>

            {/* Dark Mode */}
            <div style={{ textAlign: "center", cursor: "pointer" }} onClick={toggleTheme}>
              <img src={DarkModeIcon} alt="Dark Mode" style={{ width: "20px" }} />
              <div style={{ fontSize: "10px" }}>{isDark ? "Light Mode" : "Dark Mode"}</div>
            </div>

            {/* Help */}
            <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onHelp}>
              <img src={HelpIcon} alt="Help" style={{ width: "20px" }} />
              <div style={{ fontSize: "10px" }}>Help</div>
            </div>

            {/* Logout */}
            {!hideLogout && (
              <div
                style={{
                  textAlign: "center",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
                onClick={handleLogout}
              >
                <img src={LogoutIcon} alt="Logout" style={{ width: "20px" }} />
                <div style={{ fontSize: "10px" }}>{isLoading ? "Logging out..." : "Logout"}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default TopNavbar;
