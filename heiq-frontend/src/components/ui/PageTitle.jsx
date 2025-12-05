// src/components/ui/PageTitle.jsx
import React from "react";

const PageTitle = ({ title }) => {
  return (
    <h4 className="fw-bold mb-3" style={{ color: "#222" }}>
      {title}
    </h4>
  );
};

export default PageTitle;
