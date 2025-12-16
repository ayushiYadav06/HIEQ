import React from "react";
import { Button } from "react-bootstrap";
import ExcelIcon from "../../assets/Microsoft-excel.png";

const ExportButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="success"
      className="d-flex align-items-center gap-2 px-3 py-2 w-100 justify-content-center"
    >
      <img src={ExcelIcon} alt="excel" width={20} height={20} />
      EXPORT
    </Button>
  );
};

export default ExportButton;
