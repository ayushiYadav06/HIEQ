import React from "react";
import SearchIcon from "../../assets/Search.png";

const SearchInput = ({ placeholder }) => {
  return (
    <div className="d-flex align-items-center border rounded px-2" style={{ height: "38px" }}>
      <img src={SearchIcon} width={16} height={16} className="me-2" />
      <input
        className="form-control border-0 shadow-none"
        placeholder={placeholder}
        style={{ fontSize: "14px" }}
      />
    </div>
  );
};

export default SearchInput;
 