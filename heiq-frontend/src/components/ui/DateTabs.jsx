import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../assets/clarity_date-line.svg";

const DateTabs = ({ selected, onChange }) => {
  const [selectedDate, setSelectedDate] = useState(selected ? new Date(selected) : null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selected) {
      setSelectedDate(new Date(selected));
    } else {
      setSelectedDate(null);
    }
  }, [selected]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange?.(date);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange?.(null);
  };

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
          gap: "15px",
        }}
      >
        <img src={CalendarIcon} width={20} alt="" />
        <span className="flex-grow-1">
          {selectedDate ? selectedDate.toDateString() : "Select Date"}
        </span>
        {selectedDate && (
          <span
            onClick={handleClear}
            style={{
              cursor: "pointer",
              color: "#666",
              fontSize: "18px",
              padding: "0 5px",
            }}
            title="Clear date"
          >
            ×
          </span>
        )}
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
            onChange={handleDateChange}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default DateTabs;
