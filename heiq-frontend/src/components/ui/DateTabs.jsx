import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import CalendarIcon from "../../assets/clarity_date-line.svg"; // your calendar icon

const DateTabs = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      
      {/* DATE BOX */}
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
          gap: "8px",
        }}
      >
        {/* ICON */}
        <img
          src={CalendarIcon}
          alt="calendar"
          width={16}
          height={16}
          style={{ opacity: 0.8 }}
        />

        {/* DATE TEXT */}
        {selected.toDateString()}
      </div>

      {/* DATE PICKER DROPDOWN */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            zIndex: 50,
          }}
        >
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
