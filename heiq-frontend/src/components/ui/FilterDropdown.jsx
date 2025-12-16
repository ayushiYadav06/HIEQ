import React from "react";
import { Form } from "react-bootstrap";

const FilterDropdown = ({ value, setValue }) => {
  return (
    <Form.Select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className=" w-100"
      style={{ height: "38px", fontSize: "14px" }}
    >
      <option value="Email ID">Email ID</option>
      <option value="Name">Name</option>
      <option value="Verification Status">Verification Status</option>
      <option value="Account Status">Account Status</option>
    </Form.Select>
  );
};

export default FilterDropdown;
