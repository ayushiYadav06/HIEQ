import React from "react";

const AllJobsButton = ({ value = "All Jobs", onChange }) => {
  return (
    <select
      onChange={onChange}
      style={{
        width: "470px",
        height: "35px",
        border: "1px solid #DDDDDD",
        borderRadius: "5px",
        padding: "6px 10px",
        fontSize: "14px",
        background: "#FFFFFF",
        outline: "none",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <option>{value}</option>
    </select>
  );
};

export default AllJobsButton;
