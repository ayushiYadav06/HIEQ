import React from "react";
import { colors } from "../../theme/colors";

const Tabs = ({ active, setActive, tabs = [] }) => {
  return (
    <div
      className="tabs-wrapper w-100"
      style={{
        paddingLeft: "10px", // ⭐ EXACT SIDEBAR WIDTH
      }}
    >
      <style>
        {`
          @media (max-width: 767px) {
            .tabs-wrapper {
              padding-left: 0 !important;
            }
          }
        `}
      </style>

      {/* FULL WIDTH TAB BAR */}
      <div
        className="d-flex w-100"
        style={{
          background: "#F3F3F3",
          borderRadius: "6px",
          overflow: "hidden",
          height: "48px",
          width: "100%",      // ⭐ FULL WIDTH ALWAYS
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            className="btn flex-fill"
            onClick={() => setActive(tab)}
            style={{
              background:
                active === tab ? colors.primaryGreen : "transparent",
              color: active === tab ? "#fff" : "#000",
              border: "none",
              fontWeight: 600,
              borderRadius: 0,
              cursor: "pointer",
              zIndex: 1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
