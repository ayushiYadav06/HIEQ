import React, { useMemo } from "react";
import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/colors";
import DataTable from "../ui/DataTable";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTable = ({ users, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const getRoleBadgeColor = (role) => {
    const roleColors = {
      ADMIN: "danger",
      SUPER_ADMIN: "danger",
      EMPLOYER: "info",
      STUDENT: "success",
      CONTENT_ADMIN: "warning",
      VERIFICATION_ADMIN: "warning",
      SUPPORT_ADMIN: "warning",
    };
    return roleColors[role] || "secondary";
  };

  const handleNameClick = (id) => navigate(`/profile/${id}`);

  const handleEdit = (e, userId) => {
    e.stopPropagation();
    if (onEdit) onEdit(userId);
  };

  const handleDelete = (e, userId) => {
    e.stopPropagation();
    if (onDelete) onDelete(userId);
  };

  const columns = [
    "Name",
    "Email ID",
    "Phone",
    "Role",
    "Verification Status",
    "Account Status",
    "Registered on",
    "Actions",
  ];

  const rows = useMemo(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    () =>
      users.map((u) => ({
        Name: (
          <span
            style={{
              color: colors.primaryGreen,
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: 500,
            }}
            onClick={() => handleNameClick(u._id)}
          >
            {u.name}
          </span>
        ),
        "Email ID": u.email,
        Phone: u.phone || u.contact,
        Role: <Badge bg={getRoleBadgeColor(u.role)}>{u.role}</Badge>,
        "Verification Status": (() => {
          // Check email verification status
          const isVerified =
            u.emailVerificationStatus === "Verified" ||
            u.emailVerified === true;
          const isBlocked = u.blocked === true;

          if (isBlocked) {
            return <span style={{ color: "red" }}>Blocked</span>;
          } else if (isVerified) {
            return <span style={{ color: "green" }}>Verified</span>;
          } else {
            return <span style={{ color: "orange" }}>Pending</span>;
          }
        })(),
        "Account Status": u.deleted ? (
          <span style={{ color: "red" }}>Deleted</span>
        ) : u.blocked ? (
          <span style={{ color: "orange" }}>Blocked</span>
        ) : (
          <span style={{ color: "green" }}>Active</span>
        ),
        "Registered on": formatDate(u.createdAt),
        Actions: (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span
              onClick={(e) => handleEdit(e, u._id)}
              style={{
                cursor: "pointer",
                fontSize: "18px",
                color: colors.primaryGreen,
              }}
              title="Edit User"
            >
              <FaEdit title="Edit" />
            </span>
            <span
              onClick={(e) => handleDelete(e, u._id)}
              style={{
                cursor: "pointer",
                fontSize: "18px",
                color: "#7a1c26ff",
              }}
              title="Delete User"
            >
              <FaTrash
                title="Delete"
                className="text-red-600 cursor-pointer hover:text-red-800"
              />
            </span>
          </div>
        ),
        _id: u._id,
      })),
    [users, navigate, onEdit, onDelete]
  );

  return <DataTable columns={columns} rows={rows} emptyText="No users found" />;
};

export default UserTable;
