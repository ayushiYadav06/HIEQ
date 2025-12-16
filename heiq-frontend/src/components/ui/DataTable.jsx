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
    <>
      {/* 🌐 DESKTOP + TABLET TABLE VIEW */}
      <div className="table-responsive d-none d-md-block mt-3">
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
          <thead>
            <tr style={{ background: headerBg }}>
              {columns.map((col, index) => (
                <th
                  key={index}
                  style={{
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

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-3" style={{ color: "#dc3545", fontWeight: 500 }}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => {
                    const value = row[col];

                    const isAction = col === "action";
                    const isDeactivate = value === "Deactivate";
                    const isActivate = value === "Activate";

                    const actionColor = isDeactivate
                      ? "#dc3545"
                      : isActivate
                      ? "#28a745"
                      : "#666666";

                    return (
                      <td
                        key={colIndex}
                        style={{
                          color: isAction ? actionColor : "#666666",
                          fontWeight: isAction ? 600 : 400,
                          cursor: isAction ? "pointer" : "default",
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

      {/* 📱 MOBILE CARD VIEW */}
      <div className="d-block d-md-none mt-3">
        {rows.length === 0 ? (
          <p className="text-center" style={{ color: "#dc3545", fontWeight: 500 }}>{emptyText}</p>
        ) : (
          rows.map((row, index) => (
            <div
              key={index}
              className="p-3 mb-3 border rounded bg-white shadow-sm"
            >
              {columns.map((col, colIndex) => (
                <div key={colIndex} className="d-flex justify-content-between mb-2">
                  <strong style={{ color: "#444" }}>
                    {col.toUpperCase()}:
                  </strong>

                  <span
                    style={{
                      color:
                        col === "action"
                          ? row[col] === "Deactivate"
                            ? "#dc3545"
                            : row[col] === "Activate"
                            ? "#28a745"
                            : "#666"
                          : "#555",
                      fontWeight: col === "action" ? "600" : "400",
                    }}
                  >
                    {row[col]}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default DataTable;
