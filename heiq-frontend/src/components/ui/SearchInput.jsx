import React from "react";

const SearchInput = ({ placeholder }) => {
  return (
    <input
      placeholder={placeholder}
      style={{
        width: "381.24px",
        height: "35.21px",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #DDDDDD", // Figma: 1px
        outline: "none",
        marginTop: "538.43px",       // Figma top offset
        marginLeft: "104.37px",      // Figma left offset
        fontSize: "14px",
        background: "#FFFFFF",
      }}
    />
  );
};

export default SearchInput;
