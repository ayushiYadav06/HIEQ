// src/components/ui/AlertsContainer.jsx
import React from "react";
import { Card } from "react-bootstrap";

const AlertsContainer = ({ theme, children }) => {
  return (
    <Card
      className="border-0 shadow-sm"
      style={{
        borderRadius: "18px",
        backgroundColor: theme.surface,
      }}
    >
      <Card.Body style={{ padding: "25px" }}>
        <h5
          className="fw-semibold mb-4 d-flex align-items-center gap-2"
          style={{ color: theme.text, fontSize: "18px" }}
        >
          <span style={{ color: "#ff9f00", fontSize: "20px" }}>⚠️</span>
          Today's Alerts & Risks
        </h5>

        {children}
      </Card.Body>
    </Card>
  );
};

export default AlertsContainer;
