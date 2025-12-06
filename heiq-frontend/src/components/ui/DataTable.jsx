import React from "react";

const DataTable = ({
  columns = [],
  rows = [],
  headerColor = "#666666",
  headerBg = "#D9D9D9",
  emptyText = "No data available",
  hover = true,
}) => {
  return (
    <div className="table-responsive mt-3">
      <table
        className={`table table-bordered align-middle ${
          hover ? "table-hover" : ""
        }`}
        style={{
          tableLayout: "auto",
          width: "100%",
          background: "#FFFFFF",
        }}
      >
        {/* HEADER */}
        <thead>
          <tr style={{ background: headerBg }}>
            {columns.map((col, index) => (
              <th
                key={index}
                style={{
                  background: headerBg,
                  color: headerColor,
                  fontWeight: 600,
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                {col.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-3">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => {
                  const value = row[col];

                  // ⭐ Color logic for Action column
                  const isAction = col === "action";
                  const isDeactivate = value === "Deactivate";
                  const isActivate = value === "Activate";

                  const actionColor = isDeactivate
                    ? "#dc3545" // RED
                    : isActivate
                    ? "#28a745" // GREEN
                    : "#666666";

                  return (
                    <td
                      key={colIndex}
                      style={{
                        color: isAction ? actionColor : "#666666",
                        fontWeight: isAction ? 600 : 400,
                        cursor: isAction ? "pointer" : "default",
                        verticalAlign: "middle",
                      }}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
