import React from "react";

const StatBox = ({ label, value, color }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ color: color, fontSize: "26px" }}>{value}</h2>
      <p style={{ color: "#555", fontSize: "14px" }}>{label}</p>
    </div>
  );
};

export default StatBox;
