import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ 
  label = "Back", 
  className = "", 
  iconSize = 16,
  align = "right" // New prop: "left", "right", or "center"
}) => {
  const navigate = useNavigate();

  const getAlignmentStyle = () => {
    switch (align) {
      case "right":
        return { marginLeft: "auto", justifyContent: "flex-end" };
      case "center":
        return { margin: "0 auto", justifyContent: "center" };
      default:
        return {};
    }
  };

  return (
    <div
      onClick={() => navigate(-1)}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        width: "fit-content",
        fontSize: "15px",
        fontWeight: 500,
        color: "#666666",
        padding: "8px 0",
        ...getAlignmentStyle(),
      }}
    >
      <FaArrowLeft size={iconSize} />
      <span>{label}</span>
    </div>
  );
};

export default BackButton;