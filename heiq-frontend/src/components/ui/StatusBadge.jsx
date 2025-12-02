import React from "react";
import { colors } from "../../theme/colors";

const StatusBadge = ({ status }) => {
  const styles = {
    Awaiting: colors.awaiting,
    Rejected: colors.rejected,
    Selected: colors.selected,
    "In Progress": colors.inProgress,
    Withdrawn: colors.withdrawn,
  };

  return (
    <span
      style={{
        color: styles[status],
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
