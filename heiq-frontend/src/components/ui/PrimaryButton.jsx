import React from "react";
import { colors } from "../../theme/colors";

const PrimaryButton = ({ children, onClick, style }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: colors.primaryGreen,
        border: "none",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
