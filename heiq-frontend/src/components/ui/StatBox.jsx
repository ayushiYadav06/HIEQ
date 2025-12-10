// src/components/ui/StatBox.jsx
import React from "react";
import { Card } from "react-bootstrap";

const StatBox = ({ icon, value, change, title, theme }) => {
  return (
    <Card
      className="shadow-sm border-0 p-3 h-100"
      style={{
        borderRadius: "16px",
        backgroundColor: theme.surface,
        cursor: "pointer",
      }}
    >
      <div className="d-flex align-items-center gap-3">

        {/* ICON BOX */}
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            background: "#eef4ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            color: "#1e67ff",
          }}
        >
          {icon}
        </div>

        <div>
          {/* BIG VALUE */}
          <h3 className="fw-bold m-0" style={{ color: theme.text }}>
            {value}
          </h3>

          {/* % CHANGE */}
          <p
            className="m-0"
            style={{
              color: change.includes("-") ? "red" : "green",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {change}
          </p>
        </div>
      </div>

      {/* TITLE (LINE BELOW VALUE) */}
      <p
        className="mt-3 mb-0 fw-semibold"
        style={{ color: theme.textSecondary }}
      >
        {title}
      </p>
    </Card>
  );
};

export default StatBox;
