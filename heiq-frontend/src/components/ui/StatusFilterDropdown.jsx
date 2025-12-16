import React from "react";
import { Form } from "react-bootstrap";

const StatusFilterDropdown = ({ value, setValue, statusType }) => {
  const options = statusType === "verification" 
    ? ["Active", "Blocked"]
    : ["Active", "Deleted", "Blocked"];

  return (
    <Form.Select
      value={value || ""}
      onChange={(e) => setValue(e.target.value || null)}
      className="border-secondary w-100"
      style={{ height: "38px", fontSize: "14px" }}
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Form.Select>
  );
};

export default StatusFilterDropdown;

