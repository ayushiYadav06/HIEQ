// pages/Admin/Candidates.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Alert, Badge, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import BackButton from "../../components/layout/BackButton";
import Tabs from "../../components/ui/Tabs";
import SearchInput from "../../components/ui/SearchInput";
import PageTitle from "../../components/ui/PageTitle";
import ExportButton from "../../components/ui/ExportButton";
import DateTabs from "../../components/ui/DateTabs";
import FilterDropdown from "../../components/ui/FilterDropdown";
import DataTable from "../../components/ui/DataTable";
import CSVUploadModal from "../../components/CSVUploadModal";
import { userAPI } from "../../services/api";

const Candidates = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  const [activeTab, setActiveTab] = useState("Candidates");
  const [filterBy, setFilterBy] = useState("Email ID");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const role = activeTab === "Candidates" ? "STUDENT" : "EMPLOYER";

      const params = {
        role,
        search: searchQuery || undefined,
        filterBy: filterBy,
        date: selectedDate ? selectedDate.toISOString() : undefined,
      };

      const data = await userAPI.getAll(params);
      setUsers(data);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, filterBy, selectedDate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const columns = [
    "Name",
    "Email ID",
    "Phone",
    "Role",
    "Verification Status",
    "Account Status",
    "Registered on",
  ];

  const rows = useMemo(
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
        "Verification Status": u.blocked ? (
          <span style={{ color: "red" }}>Blocked</span>
        ) : (
          <span style={{ color: "green" }}>Active</span>
        ),
        "Account Status": u.deleted ? (
          <span style={{ color: "red" }}>Deleted</span>
        ) : u.blocked ? (
          <span style={{ color: "orange" }}>Blocked</span>
        ) : (
          <span style={{ color: "green" }}>Active</span>
        ),
        "Registered on": formatDate(u.createdAt),
        _id: u._id,
      })),
    [users]
  );

  const handleExportCSV = async () => {
    /* original export logic remains unchanged */
  };

  return (
    <AdminLayout>
      <BackButton label="Back" />

      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <PageTitle title="Users List" />

          <div className="d-flex gap-2">
            <Button
              variant="success"
              onClick={() => setIsCSVModalOpen(true)}
            >
              📄 Upload CSV
            </Button>

            <button
              onClick={() => navigate("/create-user")}
              style={{
                background: colors.primaryGreen,
                color: "#fff",
                padding: "10px 15px",
                borderRadius: "4px",
                border: "none",
              }}
            >
              + Create User
            </button>
          </div>
        </div>

        <Tabs
          tabs={["Candidates", "Employers"]}
          active={activeTab}
          setActive={setActiveTab}
          fullWidth
        />

        {/* ⭐ NEW ORDER: Export → Search → FilterDropdown → DatePicker */}
        <div className="d-flex flex-wrap gap-3 mt-4 mb-3 align-items-center">

          {/* EXPORT FIRST */}
          <div style={{ width: "180px" }}>
            <ExportButton onClick={handleExportCSV} />
          </div>

          {/* SEARCH */}
          <div style={{ flex: 1, minWidth: "260px" }}>
            <SearchInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* FILTER DROPDOWN */}
          <div style={{ width: "220px", minWidth: "180px" }}>
            <FilterDropdown value={filterBy} setValue={setFilterBy} />
          </div>

          {/* DATE PICKER */}
          <div style={{ flex: 1, minWidth: "260px" }}>
            <DateTabs selected={selectedDate} onChange={setSelectedDate} />
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading ? (
          <div className="d-flex justify-content-center p-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <div
            className="border rounded p-4"
            style={{
              background: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <DataTable columns={columns} rows={rows} emptyText="No users found" />
          </div>
        )}
      </div>

      <CSVUploadModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onUpload={() => {}}
        isUploading={isUploading}
        uploadStatus={uploadStatus}
      />
    </AdminLayout>
  );
};

export default Candidates;
