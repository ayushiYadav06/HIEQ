import React from "react";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";

const ApplicationFilters = () => {
  return (
    <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
      
      {/* SEARCH INPUT */}
      <div
        style={{
          width: "381.24px",
          height: "35.21px",
          border: "1px solid #999",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          background: "#fff",
        }}
      >
        <FaSearch size={14} color="#666" style={{ marginRight: "8px" }} />
        <input
          type="text"
          placeholder="Enter search here..."
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "13px",
            color: "#555",
          }}
        />
      </div>

      {/* ALL JOBS SELECT BOX */}
      <select
        style={{
          width: "263.15px",
          height: "35.21px",
          border: "1px solid #999",
          borderRadius: "5px",
          padding: "0 10px",
          outline: "none",
          fontSize: "13px",
          color: "#666666",
          background: "#fff",
        }}
      >
        <option>All jobs</option>
        <option>Selected</option>
        <option>Rejected</option>
        <option>Awaiting</option>
      </select>

      {/* DATE RANGE FILTER */}
      <div
        style={{
          width: "313.21px",
          height: "35.21px",
          border: "1px solid #999",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          background: "#fff",
          color: "#666",
          fontSize: "13px",
          gap: "10px",
        }}
      >
        <FaCalendarAlt size={14} />
        <span>31 Dec 2021 - 15 Jan 2022</span>
      </div>

    </div>
  );
};

export default ApplicationFilters;
