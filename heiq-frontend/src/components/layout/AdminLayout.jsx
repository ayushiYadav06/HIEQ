import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

const NAVBAR_HEIGHT = 70;
const SIDEBAR_WIDTH = 210;

const AdminLayout = ({ children }) => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: themeColors.background,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed Top Navbar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: `${NAVBAR_HEIGHT}px`,
        }}
      >
        <TopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Fixed Sidebar - Desktop Only */}
      <div
        className="d-none d-md-block"
        style={{
          position: "fixed",
          top: `${NAVBAR_HEIGHT}px`,
          left: 0,
          bottom: 0,
          zIndex: 999,
          width: `${SIDEBAR_WIDTH}px`,
        }}
      >
        <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Scrollable Content Area */}
      <div
        className="d-none d-md-block"
        style={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          marginTop: `${NAVBAR_HEIGHT}px`,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          backgroundColor: themeColors.background,
          overflowY: "auto",
          overflowX: "hidden",
          transition: "background-color 0.3s ease",
        }}
      >
        <div
          style={{
            padding: "20px",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      </div>

      {/* Mobile Content Area */}
      <div
        className="d-block d-md-none"
        style={{
          marginTop: `${NAVBAR_HEIGHT}px`,
          width: "100%",
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          backgroundColor: themeColors.background,
          overflowY: "auto",
          overflowX: "hidden",
          transition: "background-color 0.3s ease",
        }}
      >
        <div
          style={{
            padding: "20px",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

