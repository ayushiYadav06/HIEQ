import React from "react";
import { colors } from "../../theme/colors";

const Tabs = ({ active, setActive }) => {
  return (
    <div
      className="tabs"
      style={{
        display: "flex",
        flex: 1,
        height: "44px",
        background: "#F3F3F3",
        borderRadius: "4px",
        overflow: "hidden",
        minWidth: "250px",
      }}
    >
      {["Jobs", "Internships"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          style={{
            flex: 1,
            background: active === tab ? colors.primaryGreen : "transparent",
            color: active === tab ? "#fff" : "#555",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
