import React from "react";

const CardContainer = ({ children }) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #e6e6e6",
        marginTop: "20px",
      }}
    >
      {children}
    </div>
  );
};

export default CardContainer;
