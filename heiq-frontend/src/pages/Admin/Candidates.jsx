// pages/Admin/Candidates.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import BackButton from "../../components/layout/BackButton";
import Tabs from "../../components/ui/Tabs";
import SearchInput from "../../components/ui/SearchInput";
import PageTitle from "../../components/ui/PageTitle";
import ExportButton from "../../components/ui/ExportButton";
import FilterDropdown from "../../components/ui/FilterDropdown";
import DataTable from "../../components/ui/DataTable";
import { userAPI } from "../../services/api";
import { Table, Badge, Spinner } from "react-bootstrap";

const Candidates = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [activeTab, setActiveTab] = useState("Candidates");
  const [filterBy, setFilterBy] = useState("Email ID");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const role = activeTab === "Candidates" ? "STUDENT" : "EMPLOYER";
      const params = {
        role,
        search: searchQuery || undefined,
      };
      const data = await userAPI.getAll(params);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    const roleColors = {
      ADMIN: "danger",
      SUPER_ADMIN: "danger",
      EMPLOYER: "info",
      STUDENT: "success",
      JOB_SEEKER: "success",
      CONTENT_ADMIN: "warning",
      VERIFICATION_ADMIN: "warning",
      SUPPORT_ADMIN: "warning",
    };
    return roleColors[role] || "secondary";
  };

  // Handle name click
  const handleNameClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Prepare table data
  const columns = [
    "Name",
    "Email ID",
    "Phone",
    "Role",
    "Verification Status",
    "Account Status",
    "Registered on",
  ];

  const rows = useMemo(() => {
    return users.map((user) => ({
      Name: (
        <span
          style={{
            color: colors.primaryGreen,
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: 500,
          }}
          onClick={() => handleNameClick(user._id)}
        >
          {user.name}
        </span>
      ),
      "Email ID": user.email || "N/A",
      Phone: user.phone || user.contact || "N/A",
      Role: (
        <Badge bg={getRoleBadgeColor(user.role)}>
          {user.role || "N/A"}
        </Badge>
      ),
      "Verification Status": user.blocked ? (
        <span style={{ color: "red" }}>Blocked</span>
      ) : (
        <span style={{ color: "green" }}>Active</span>
      ),
      "Account Status": user.deleted ? (
        <span style={{ color: "red" }}>Deleted</span>
      ) : user.blocked ? (
        <span style={{ color: "orange" }}>Blocked</span>
      ) : (
        <span style={{ color: "green" }}>Active</span>
      ),
      "Registered on": formatDate(user.createdAt),
      _id: user._id, // Keep ID for reference
    }));
  }, [users]);

  return (
    <AdminLayout>
      <BackButton label="Back" />

      <div className="mt-4">
        {/* Title + Create Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <PageTitle title="Users List" />

          <button
            className="create-btn"
            onClick={() => navigate("/create-user")}
            style={{
              background: colors.primaryGreen,
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <span className="plus">+</span> Create User
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <Tabs
            tabs={["Candidates", "Employers"]}
            active={activeTab}
            setActive={setActiveTab}
            fullWidth
          />
        </div>

        {/* Filter Bar */}
        <div className="d-flex flex-column flex-md-row gap-3 mb-4">
          <div style={{ flex: 1, maxWidth: "400px" }}>
            <SearchInput
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <ExportButton />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="alert alert-danger"
            style={{ marginBottom: "20px" }}
          >
            {error}
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div
            className="border rounded p-4"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <DataTable
              columns={columns}
              rows={rows}
              headerColor={themeColors.text}
              headerBg={themeColors.background}
              emptyText="No users found"
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Candidates;
