import React from "react";
import { Table } from "react-bootstrap";

const SupportTable = ({ theme, data = [] }) => {
  // Ensure data is always an array
  const rows = Array.isArray(data) ? data : [];

  return (
    <Table hover responsive>
      <thead>
        <tr style={{ color: theme.text }}>
          <th>Ticket ID</th>
          <th>Category</th>
          <th>Agent</th>
          <th>Status</th>
          <th>Age (hrs)</th>
        </tr>
      </thead>

      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center text-muted py-4">
              No records found
            </td>
          </tr>
        ) : (
          rows.map((row, idx) => (
            <tr key={idx} style={{ color: theme.text }}>
              <td className="text-primary">{row.id}</td>
              <td>{row.category}</td>
              <td>{row.agent}</td>
              <td>
                <span
                  className={`badge px-3 py-2 ${
                    row.status === "Open"
                      ? "bg-danger"
                      : row.status === "In Progress"
                      ? "bg-primary"
                      : row.status === "Waiting"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className={row.age > 40 ? "text-danger" : ""}>{row.age}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default SupportTable;
