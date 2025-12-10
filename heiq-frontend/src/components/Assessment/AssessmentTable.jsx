import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";

const AssessmentTable = ({
  data = [],
  onEdit,
  onDelete,
  onStatusToggle,
  isLoading = false,
}) => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div style={{ color: themeColors.textSecondary }}>Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ color: themeColors.textSecondary }}>No data available</div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="table-responsive d-none d-md-block">
        <table
          className="table table-bordered align-middle table-hover"
          style={{
            width: "100%",
            backgroundColor: themeColors.surface,
            color: themeColors.text,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: themeColors.border }}>
              <th
                style={{
                  color: themeColors.text,
                  fontWeight: 600,
                  fontSize: "14px",
                  padding: "12px",
                }}
              >
                NAME
              </th>
              <th
                style={{
                  color: themeColors.text,
                  fontWeight: 600,
                  fontSize: "14px",
                  padding: "12px",
                }}
              >
                STATUS
              </th>
              <th
                style={{
                  color: themeColors.text,
                  fontWeight: 600,
                  fontSize: "14px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: `1px solid ${themeColors.border}`,
                }}
              >
                <td style={{ color: themeColors.text, padding: "12px" }}>
                  {item.name}
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => onStatusToggle(item.id, !item.status)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 500,
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: item.status
                        ? "#d4edda"
                        : themeColors.border,
                      color: item.status ? "#155724" : themeColors.textSecondary,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = "1";
                    }}
                  >
                    {item.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "14px",
                        backgroundColor: "#007bff",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#0056b3";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#007bff";
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "14px",
                        backgroundColor: "#dc3545",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#c82333";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#dc3545";
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="d-block d-md-none">
        {data.map((item) => (
          <div
            key={item.id}
            className="mb-3 p-3 border rounded"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <div className="d-flex justify-content-between mb-2">
              <strong style={{ color: themeColors.text }}>Name:</strong>
              <span style={{ color: themeColors.text }}>{item.name}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <strong style={{ color: themeColors.text }}>Status:</strong>
              <button
                onClick={() => onStatusToggle(item.id, !item.status)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: item.status
                    ? "#d4edda"
                    : themeColors.border,
                  color: item.status ? "#155724" : themeColors.textSecondary,
                }}
              >
                {item.status ? "Active" : "Inactive"}
              </button>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button
                onClick={() => onEdit(item)}
                style={{
                  padding: "6px 12px",
                  fontSize: "14px",
                  backgroundColor: "#007bff",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                style={{
                  padding: "6px 12px",
                  fontSize: "14px",
                  backgroundColor: "#dc3545",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AssessmentTable;
