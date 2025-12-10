// src/components/ui/AlertBox.jsx
import React from "react";

const AlertBox = ({ borderColor, dotColor, title, description }) => {
  return (
    <div
      className="p-3 mb-3"
      style={{
        borderRadius: "12px",
        border: `1px solid ${borderColor}`,
        background: "#ffffff",
      }}
    >
      <div className="d-flex align-items-start gap-2">
        {/* DOT ICON */}
        <span
          style={{
            height: "10px",
            width: "10px",
            backgroundColor: dotColor,
            borderRadius: "50%",
            marginTop: "6px",
          }}
        ></span>

        {/* TEXT */}
        <div>
          <strong style={{ fontSize: "15px" }}>{title}</strong>
          <p className="m-0 text-muted" style={{ fontSize: "13px" }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
