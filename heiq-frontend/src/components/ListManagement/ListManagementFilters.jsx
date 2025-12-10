import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";

const ListManagementFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  return (
    <div className="d-flex flex-column flex-md-row gap-3 mb-3">
      <div className="flex-fill">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-control"
          style={{
            backgroundColor: themeColors.background,
            color: themeColors.text,
            borderColor: themeColors.border,
            padding: "8px 12px",
          }}
        />
      </div>
      <div style={{ width: "100%", maxWidth: "200px" }}>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="form-control"
          style={{
            backgroundColor: themeColors.background,
            color: themeColors.text,
            borderColor: themeColors.border,
            padding: "8px 12px",
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default ListManagementFilters;

