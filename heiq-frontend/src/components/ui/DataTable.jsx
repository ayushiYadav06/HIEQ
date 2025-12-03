import React from "react";
import StatusBadge from "./StatusBadge";

const DataTable = ({ columns = [], rows = [] }) => {
  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={{ fontWeight: 600 }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4"
                style={{ color: "#777" }}
              >
                No data available
              </td>
            </tr>
          )}

          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.title}</td>
              <td>{row.company}</td>
              <td>
                <StatusBadge status={row.status} />
              </td>
              <td>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; // ✅ FIXED — now exporting default
