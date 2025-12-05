import React from "react";
import SearchIcon from "../../assets/vector_(5).png"; 

const SearchInput = ({ placeholder }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "35px",
        display: "flex",
        alignItems: "center",
        border: "1px solid #DDD",
        borderRadius: "6px",
        background: "#FFFFFF",
        paddingLeft: "10px",
      }}
    >
      {/* ICON */}
      <img
        src={SearchIcon}
        alt="search"
        width={16}
        height={16}
        style={{ marginRight: "8px" }}
      />

      {/* INPUT FIELD */}
      <input
        placeholder={placeholder}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
          fontSize: "14px",
          background: "transparent",
        }}
      />
    </div>
  );
};

export default SearchInput;
