import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../assets/clarity_date-line.svg";

const DateTabs = ({ selected, onChange }) => {
  const [selectedDate, setSelectedDate] = useState(selected || new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selected) setSelectedDate(new Date(selected));
  }, [selected]);

  return (
    <div style={{ position: "relative", maxWidth: "450px" }} className="w-100">
      {/* Clickable Field */}
      <div
        onClick={() => setOpen(!open)}
        className="d-flex align-items-center border rounded px-3 w-100"
        style={{
          height: "40px",
          cursor: "pointer",
          background: "#fff",
          gap: "15px", // ⭐ increased gap between icon and date
        }}
      >
        <img src={CalendarIcon} width={20} alt="" />
        <span className="flex-grow-1">{selectedDate.toDateString()}</span>
      </div>

      {/* Calendar popup */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            background: "#fff",
          }}
        >
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              onChange?.(date);
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
