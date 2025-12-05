// src/components/ui/ExportButton.jsx
import React from "react";
import { Button } from "react-bootstrap";
import ExcelIcon from "../../assets/file-icons_microsoft-excel.png";

const ExportButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="success"
      className="btn-lg d-flex align-items-center gap-5 px-5 fw-semibold"
    >
      <img
        src={ExcelIcon}
        alt="excel"
        className="img-fluid"
        style={{ width: "24px", height: "24px" }}
      />
      EXPORT
    </Button>
  );
};

export default ExportButton;
