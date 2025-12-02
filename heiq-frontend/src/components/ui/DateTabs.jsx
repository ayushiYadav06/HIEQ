import React from "react";

const DateTabs = ({ selected, onChange }) => {
  const options = ["Today", "This Week", "This Month"];

  return (
    <div
      className="date-tabs"
      style={{
        width: "313px",
        height: "35px",
        display: "flex",
        border: "1px solid #999999",
        borderRadius: "4px",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {options.map((opt) => (
        <div
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "14px",
            color: selected === opt ? "#000" : "#999",
            background: selected === opt ? "#E6E6E6" : "#FFFFFF",
            borderRight: "1px solid #999",
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  );
};

export default DateTabs;
