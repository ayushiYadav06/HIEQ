import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { colors } from "../../../theme/colors";
import { assessmentAPI } from "../../../services/api";
import AdminLayout from "../../../components/layout/AdminLayout";
import BackButton from "../../../components/layout/BackButton";
import AssessmentTable from "../../../components/Assessment/AssessmentTable";
import AssessmentForm from "../../../components/Assessment/AssessmentForm";
import AssessmentFilters from "../../../components/Assessment/AssessmentFilters";

const ASSESSMENT_TABS = ["Skills", "College", "Jobs", "Industries"];

const AssessmentList = () => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [activeTab, setActiveTab] = useState("Skills");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data state - store all tabs data
  const [data, setData] = useState({
    Skills: [],
    College: [],
    Jobs: [],
    Industries: [],
  });

  // Fetch data when tab changes
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // Fetch data from API
  const fetchData = async (type) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery) {
        params.search = searchQuery;
      }
      if (statusFilter !== "all") {
        params.status = statusFilter === "active";
      }

      const items = await assessmentAPI.getByType(type, params);
      // Map _id to id for frontend compatibility
      const mappedItems = items.map((item) => ({
        ...item,
        id: item._id,
      }));

      setData((prev) => ({
        ...prev,
        [type]: mappedItems,
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData(activeTab);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter]);

  // Get current tab data
  const currentData = useMemo(() => data[activeTab] || [], [data, activeTab]);

  // Filtered data (client-side filtering as backup)
  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.status) ||
        (statusFilter === "inactive" && !item.status);
      return matchesSearch && matchesStatus;
    });
  }, [currentData, searchQuery, statusFilter]);

  // Handle create
  const handleCreate = useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  // Handle edit
  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  // Handle delete
  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        setIsLoading(true);
        try {
          await assessmentAPI.delete(activeTab, id);
          // Remove from local state
          setData((prev) => ({
            ...prev,
            [activeTab]: prev[activeTab].filter((item) => item.id !== id),
          }));
        } catch (err) {
          console.error("Error deleting item:", err);
          alert(err.message || "Failed to delete item");
        } finally {
          setIsLoading(false);
        }
      }
    },
    [activeTab]
  );

  // Handle status toggle
  const handleStatusToggle = useCallback(
    async (id, newStatus) => {
      try {
        const updatedItem = await assessmentAPI.toggleStatus(
          activeTab,
          id,
          newStatus
        );
        // Update local state
        setData((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].map((item) =>
            item.id === id
              ? { ...item, ...updatedItem, id: updatedItem._id || id }
              : item
          ),
        }));
      } catch (err) {
        console.error("Error toggling status:", err);
        alert(err.message || "Failed to update status");
      }
    },
    [activeTab]
  );

  // Handle form submit
  const handleFormSubmit = useCallback(
    async (formData) => {
      setIsLoading(true);
      try {
        if (editingItem) {
          // Update existing
          const updatedItem = await assessmentAPI.update(
            activeTab,
            editingItem.id,
            formData
          );
          setData((prev) => ({
            ...prev,
            [activeTab]: prev[activeTab].map((item) =>
              item.id === editingItem.id
                ? { ...updatedItem, id: updatedItem._id || editingItem.id }
                : item
            ),
          }));
        } else {
          // Create new
          const newItem = await assessmentAPI.create(activeTab, formData);
          setData((prev) => ({
            ...prev,
            [activeTab]: [
              ...prev[activeTab],
              { ...newItem, id: newItem._id },
            ],
          }));
        }
        setIsFormOpen(false);
        setEditingItem(null);
      } catch (err) {
        console.error("Error saving item:", err);
        alert(err.message || "Failed to save item");
      } finally {
        setIsLoading(false);
      }
    },
    [editingItem, activeTab]
  );

  // Reset filters when tab changes
  useEffect(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setIsFormOpen(false);
    setEditingItem(null);
  }, [activeTab]);

  return (
    <>
      <AdminLayout>
        <BackButton label="Back" />

        <div className="mt-4">
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 600,
                marginBottom: "20px",
                color: themeColors.text,
              }}
            >
              Assessment Management
            </h1>

            {error && (
              <div
                className="alert alert-danger"
                style={{ marginBottom: "20px" }}
              >
                {error}
              </div>
            )}

            {/* Tabs */}
            <div style={{ marginBottom: "24px" }}>
              <div
                className="d-flex"
                style={{
                  borderBottom: `2px solid ${themeColors.border}`,
                  gap: "8px",
                }}
              >
                {ASSESSMENT_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="btn"
                    style={{
                      padding: "12px 24px",
                      fontWeight: 500,
                      fontSize: "15px",
                      border: "none",
                      borderBottom:
                        activeTab === tab
                          ? `2px solid ${colors.primaryGreen}`
                          : "2px solid transparent",
                      backgroundColor: "transparent",
                      color:
                        activeTab === tab
                          ? colors.primaryGreen
                          : themeColors.textSecondary,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      marginBottom: "-2px",
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab) {
                        e.target.style.backgroundColor = themeColors.border;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab) {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters and Add Button */}
            <div style={{ marginBottom: "20px" }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <div className="flex-fill w-100" style={{ maxWidth: "600px" }}>
                  <AssessmentFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                  />
                </div>
                <button
                  onClick={handleCreate}
                  disabled={isLoading}
                  className="btn"
                  style={{
                    padding: "10px 24px",
                    backgroundColor: colors.primaryGreen,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: 600,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1,
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    fontSize: "15px",
                    minWidth: "150px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.opacity = "0.9";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.opacity = "1";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                    }
                  }}
                >
                  + Create {activeTab === "Skills" ? "Skill" : activeTab === "College" ? "College" : activeTab === "Jobs" ? "Job" : "Industry"}
                </button>
              </div>
            </div>

            {/* Table */}
            <div
              className="border rounded p-4"
              style={{
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border,
              }}
            >
              <AssessmentTable
                data={filteredData}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
                isLoading={isLoading}
              />
            </div>
          </div>
      </AdminLayout>

      {/* Form Modal */}
      <AssessmentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
      />
    </>
  );
};

export default AssessmentList;
