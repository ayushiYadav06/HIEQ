import React from "react";

const ActionButton = ({
  type = "activate", // activate | deactivate
  label,
  onClick,
  fullWidth = false,
}) => {
  // Colors
  const colors = {
    activate: "#28a745",   // green
    deactivate: "#D9534F", // red
  };

  return (
    <button
      onClick={onClick}
      className="btn"
      style={{
        background: colors[type],
        color: "#fff",
        padding: "10px 40px",
        borderRadius: "30px",
        fontWeight: 600,
        width: fullWidth ? "100%" : "auto",
      }}
    >
      {label ? label : type === "activate" ? "Activate" : "Deactivate"}
    </button>
  );
};

export default ActionButton;
