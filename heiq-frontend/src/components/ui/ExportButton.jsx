// src/components/ui/ExportButton.jsx
import React from "react";
import { Button } from "react-bootstrap";
import ExcelIcon from "../../assets/file-icons_microsoft-excel.png";

const ExportButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="success"
      className="d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
    >
      <img
        src={ExcelIcon}
        alt="excel"
        className="img-fluid"
        style={{ width: "10px", height: "20px" }}
      />
      EXPORT
    </Button>
  );
};

export default ExportButton;
