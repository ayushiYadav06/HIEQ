import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateTabs = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          height: "35px",
          border: "1px solid #999",
          borderRadius: "5px",
          padding: "6px 10px",
          background: "#fff",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {selected.toDateString()}
      </div>

      {open && (
        <div style={{ position: "absolute", zIndex: 50 }}>
          <DatePicker
            selected={selected}
            onChange={(date) => {
              onChange(date);
              setOpen(false);
            }}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default DateTabs;
