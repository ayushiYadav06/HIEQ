// src/components/ui/FilterDropdown.jsx
import React from "react";
import { Form } from "react-bootstrap";

const FilterDropdown = ({ value, setValue }) => {
  return (
    <Form.Select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="border-secondary"
    >
      <option value="Email ID">Email ID</option>
      <option value="Name">Name</option>
      <option value="Phone">Phone</option>
      <option value="Verification Status">Verification Status</option>
    </Form.Select>
  );
};

export default FilterDropdown;
