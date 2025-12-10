import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logoutUser } from "../../store/slices/authSlice";

// CUSTOM ICONS
import NotificationIcon from "../../assets/Vector.png";
import DarkModeIcon from "../../assets/Vector (1).png";
import HelpIcon from "../../assets/Vector (2).png";
import LogoutIcon from "../../assets/logout.png";
import Logo from "../../assets/hieqLogo.png"; // ⭐ LOGO NOW HERE

const TopNavbar = ({
  onHelp = () => {},
  onNotifications = () => {},
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      console.loog(error)
      navigate("/login", { replace: true });
    }
  };

  const onDarkMode = () => {
    alert("Dark mode toggle clicked!");
  }
  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #e6e6e6",
        display: "flex",
        justifyContent: "space-between", // ⭐ LEFT = LOGO, RIGHT = ICONS
        alignItems: "center",
        padding: "0 20px",
        height: "70px",
        position: "sticky",
        top: 0,
        zIndex: 90,
        transition: "0.3s",
      }}
    >

      {/* ⭐ LOGO ON LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={Logo}
          alt="HieQ Logo"
          style={{ height: "45px", cursor: "pointer" }}
        />
      </div>

      {/* RIGHT SIDE ICONS */}
      <div style={{ display: "flex", alignItems: "center", gap: "30px", color: "#666" }}>
        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onNotifications}>
          <img src={NotificationIcon} alt="Notification" style={{ width: "20px", height: "20px" }} />
          <div style={{ fontSize: "10px" }}>Notifications</div>
        </div>

        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onDarkMode}>
          <img src={DarkModeIcon} alt="Dark Mode" style={{ width: "20px", height: "20px" }} />
          <div style={{ fontSize: "10px" }}>Dark Mode</div>
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
  );
};

export default TopNavbar;
