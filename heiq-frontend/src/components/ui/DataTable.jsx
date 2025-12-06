import React from "react";

const DataTable = ({ columns, rows }) => {
  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col, j) => (
                <td key={j}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
