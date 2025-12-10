import React from "react";
import { Card } from "react-bootstrap";

const QuickActionBox = ({ label, color, icon, onClick }) => (
  <Card
    onClick={onClick}
    className="shadow-sm border-0 text-center p-4 h-100"
    style={{
      borderRadius: "12px",
      backgroundColor: color,
      cursor: "pointer",
      transition: "0.2s",
    }}
  >
    <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
    <span className="fw-semibold">{label}</span>
  </Card>
);

export default QuickActionBox;
