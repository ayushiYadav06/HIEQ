// src/components/ui/ExportButton.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { BsDownload } from "react-icons/bs";

const ExportButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="px-3"
      style={{ background: "#4CAF50", border: "none", fontWeight: 600 }}
    >
      <BsDownload className="me-2" size={18} />
      EXPORT
    </Button>
  );
};

export default ExportButton;
