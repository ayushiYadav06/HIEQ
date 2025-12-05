import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import CalendarIcon from "../../assets/clarity_date-line.svg";

const DateTabs = ({ selected, onChange }) => {
  // Always have a valid date
  const [selectedDate, setSelectedDate] = useState(selected || new Date());
  const [open, setOpen] = useState(false);

  // Sync parent → child updates
  useEffect(() => {
    if (selected) setSelectedDate(new Date(selected));
  }, [selected]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      
      {/* DATE INPUT BOX */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          height: "38px",
          border: "1px solid #999",
          borderRadius: "5px",
          padding: "6px 10px",
          background: "#fff",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        {/* ICON */}
        <img
          src={CalendarIcon}
          alt="calendar"
          width={17}
          height={17}
          style={{ opacity: 0.8 }}
        />

        {/* SAFE DATE TEXT */}
        <span>
          {selectedDate ? selectedDate.toDateString() : "Select Date"}
        </span>
      </div>

      {/* POPUP DATE PICKER */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            zIndex: 100,
            background: "#fff",
            borderRadius: "6px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              const newDate = new Date(date);
              setSelectedDate(newDate);
              if (onChange) onChange(newDate);
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
