import React from "react";
import SearchIcon from "../../assets/Search.png";

const SearchInput = ({ placeholder, value, onChange }) => {
  return (
    <div
      className="d-flex align-items-center border rounded px-2 w-100"
      style={{ height: "38px" }}
    >
      <img src={SearchIcon} width={25} height={20} className="me-2" />
      <input
        className="form-control border-0 shadow-none"
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        style={{ fontSize: "16px" }}
      />
    </div>
  );
};

export default SearchInput;
