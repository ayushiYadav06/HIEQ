// src/components/ui/ExportButton.jsx
import React from "react";
import { Button } from "react-bootstrap";
import ExcelIcon from "../../assets/Microsoft-excel.png";

const styles = {
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "22px", // spacing between icon & text
    padding: "16px 36px", // increased box size
    fontWeight: 600,
    fontSize: "16px",
    border: "none",
    borderRadius: "8px", // rounded button
  },
  icon: {
    width: "26px",
    height: "26px",
    objectFit: "contain",
  },
  text: {
    letterSpacing: "1px",
  },
};

const ExportButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} variant="success" style={styles.button}>
      <img src={ExcelIcon} alt="excel" style={styles.icon} />
      <span style={styles.text}>EXPORT</span>
    </Button>
  );
};

export default ExportButton;
