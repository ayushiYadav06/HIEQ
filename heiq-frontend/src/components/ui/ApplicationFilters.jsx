import React from "react";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";

const ApplicationFilters = () => {
  return (
    <div className="row g-3 mt-3">

      {/* SEARCH INPUT */}
      <div className="col-lg-4 col-md-6 col-12">
        <div className="input-group">
          <span className="input-group-text bg-white border-secondary">
            <FaSearch size={14} color="#666" />
          </span>
          <input
            type="text"
            className="form-control border-secondary"
            placeholder="Enter search here..."
            style={{ fontSize: "14px", color: "#666" }}
          />
        </div>
      </div>

      {/* ALL JOBS DROPDOWN */}
      <div className="col-lg-3 col-md-6 col-12">
        <select
          className="form-select border-secondary"
          style={{ fontSize: "14px", color: "#666" }}
        >
          <option>All Jobs</option>
          <option>Selected</option>
          <option>Rejected</option>
          <option>Awaiting</option>
        </select>
      </div>

      {/* DATE RANGE */}
      <div className="col-lg-4 col-md-6 col-12">
        <div className="input-group">
          <span className="input-group-text bg-white border-secondary">
            <FaCalendarAlt size={14} color="#666" />
          </span>
          <span
            className="form-control border-secondary d-flex align-items-center"
            style={{ fontSize: "14px", color: "#666" }}
          >
            31 Dec 2021 - 15 Jan 2022
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;
