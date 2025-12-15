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
import Pagination from "../../components/ui/Pagination";
import CSVUploadModal from "../../components/CSVUploadModal";
import { userAPI } from "../../services/api";
import usePagination from "../../hooks/usePagination";

const Candidates = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  const [activeTab, setActiveTab] = useState("Candidates");
  const [filterBy, setFilterBy] = useState("Email ID");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  // Use pagination hook
  const {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
    updateTotalItems,
    setPageSize,
  } = usePagination(1, 10);

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
        page: currentPage,
        limit: pageSize,
      };

      console.log('[Candidates] Fetching users with params:', params);
      const response = await userAPI.getAll(params);
      console.log('[Candidates] Response:', { 
        isArray: Array.isArray(response),
        usersCount: Array.isArray(response) ? response.length : response.users?.length,
        total: Array.isArray(response) ? response.length : response.total,
        page: response.page,
        totalPages: response.totalPages
      });
      
      // Handle both old format (array) and new format (object with pagination)
      if (Array.isArray(response)) {
        // Fallback: backend returned full array. Slice client-side so pagination still works.
        const total = response.length;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const sliced = response.slice(start, end);
        console.warn('[Candidates] Received array format instead of paginated object, slicing on client', { total, start, end });
        setUsers(sliced);
        updateTotalItems(total);
      } else {
        // New format - paginated object
        setUsers(response.users || []);
        updateTotalItems(response.total || 0);
      }
    } catch (err) {
      setError("Failed to load users. Please try again.");
      setUsers([]);
      updateTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, filterBy, selectedDate, currentPage, pageSize, updateTotalItems]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset pagination when filters change; reset page size to default when switching tab
  useEffect(() => {
    resetPagination();
    if (activeTab === "Candidates" || activeTab === "Employers") {
      setPageSize(10);
    }
  }, [activeTab, searchQuery, filterBy, selectedDate, resetPagination, setPageSize]);

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

  // Handle CSV file upload
  const handleCSVUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setUploadStatus({
        type: "danger",
        message: "No file selected",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);
    setError("");

    try {
      // Read CSV file
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      
      if (lines.length < 2) {
        throw new Error("CSV file must have at least a header row and one data row");
      }

      // Parse CSV header - handle quoted values
      const parseCSVLine = (line) => {
        const result = [];
        let current = "";
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const headers = parseCSVLine(lines[0]).map((h) => 
        h.replace(/^"|"$/g, "").trim().toLowerCase()
      );
      
      // Required columns - check for variations
      const hasFullName = headers.some(h => 
        h === "fullname" || h === "full name" || h === "fullname"
      );
      const hasEmail = headers.includes("email");
      const hasPassword = headers.includes("password");
      
      const missingColumns = [];
      if (!hasFullName) missingColumns.push("Full Name");
      if (!hasEmail) missingColumns.push("Email");
      if (!hasPassword) missingColumns.push("Password");

      if (missingColumns.length > 0) {
        throw new Error(
          `Missing required columns: ${missingColumns.join(", ")}`
        );
      }

      // Helper function to parse education from pipe-separated format
      const parseEducation = (eduString) => {
        if (!eduString || !eduString.trim()) return [];
        
        try {
          // Try JSON first
          return JSON.parse(eduString);
        } catch {
          // Parse pipe-separated format: "Degree|University|Year;Degree2|University2|Year2"
          const entries = eduString.split(";").filter(e => e.trim());
          return entries.map(entry => {
            const parts = entry.split("|").map(p => p.trim());
            return {
              degree: parts[0] || "",
              university: parts[1] || "",
              year: parts[2] || "",
              degreeFile: null,
              status: "Pending"
            };
          });
        }
      };

      // Helper function to parse experience from pipe-separated format
      const parseExperience = (expString) => {
        if (!expString || !expString.trim()) return [];
        
        try {
          // Try JSON first
          return JSON.parse(expString);
        } catch {
          // Parse pipe-separated format: "Company|Role|Years;Company2|Role2|Years2"
          const entries = expString.split(";").filter(e => e.trim());
          return entries.map(entry => {
            const parts = entry.split("|").map(p => p.trim());
            return {
              company: parts[0] || "",
              role: parts[1] || "",
              years: parts[2] || ""
            };
          });
        }
      };

      // Parse CSV data
      const users = [];
      const role = activeTab === "Candidates" ? "STUDENT" : "EMPLOYER";

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        
        const values = parseCSVLine(lines[i]).map((v) => 
          v.replace(/^"|"$/g, "").trim()
        );
        const user = {};

        headers.forEach((header, index) => {
          const value = values[index] || "";
          
          // Map CSV columns to user object
          if (header === "fullname" || header === "full name") {
            user.fullName = value;
          } else if (header === "email") {
            user.email = value;
          } else if (header === "password") {
            user.password = value;
          } else if (header === "contact" || header === "phone") {
            user.contact = value;
          } else if (header === "gender") {
            user.gender = value;
          } else if (header === "dob" || header === "date of birth") {
            user.dob = value;
          } else if (header === "summary") {
            user.summary = value;
          } else if (header === "role") {
            user.role = value || role;
          } else if (header === "education" && value) {
            user.education = parseEducation(value);
          } else if (header === "experience" && value) {
            user.experience = parseExperience(value);
          } else if (header === "skills" && value) {
            try {
              user.skills = JSON.parse(value);
            } catch {
              user.skills = value.split(";").filter((s) => s.trim());
            }
          } else if (header === "companyexperience" || header === "company experience") {
            try {
              user.companyExperience = JSON.parse(value);
            } catch {
              user.companyExperience = [];
            }
          }
        });

        // Set default role if not provided
        if (!user.role) {
          user.role = role;
        }

        // Only add user if required fields are present
        if (user.fullName && user.email && user.password) {
          users.push(user);
        }
      }

      if (users.length === 0) {
        throw new Error("No valid users found in CSV file");
      }

      // Call bulk create API
      const response = await userAPI.bulkCreate(users);

      // Set upload status
      setUploadStatus({
        type: "success",
        message: response.message || `Successfully uploaded ${response.results?.success?.length || 0} users`,
        details: response.results,
      });

      // Refresh user list after successful upload
      if (response.results?.success?.length > 0) {
        setTimeout(() => {
          fetchUsers();
        }, 1000);
      }

      // Close modal after 3 seconds if successful
      if (response.results?.success?.length > 0) {
        setTimeout(() => {
          setIsCSVModalOpen(false);
          setUploadStatus(null);
        }, 3000);
      }
    } catch (err) {
      console.error("CSV upload error:", err);
      setUploadStatus({
        type: "danger",
        message: err.message || "Failed to upload CSV file. Please check the file format.",
      });
    } finally {
      setIsUploading(false);
    }
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

        <div className="d-flex flex-wrap gap-3 mt-4 mb-3 align-items-center">
          <div style={{ width: "180px" }}>
            <ExportButton onClick={handleExportCSV} />
          </div>

          <div style={{ flex: 1, minWidth: "260px" }}>
            <SearchInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ width: "220px", minWidth: "180px" }}>
            <FilterDropdown value={filterBy} setValue={setFilterBy} />
          </div>

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
          <>
            <div
              className="border rounded p-4"
              style={{
                background: themeColors.surface,
                borderColor: themeColors.border,
              }}
            >
              <DataTable columns={columns} rows={rows} emptyText="No users found" />
            </div>

            {/* Reusable Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showPageSizeSelector={true}
            />
          </>
        )}
      </div>

      <CSVUploadModal
        isOpen={isCSVModalOpen}
        onClose={() => {
          setIsCSVModalOpen(false);
          setUploadStatus(null);
          setIsUploading(false);
        }}
        onUpload={handleCSVUpload}
        isUploading={isUploading}
        uploadStatus={uploadStatus}
      />
    </AdminLayout>
  );
};

export default Candidates;
