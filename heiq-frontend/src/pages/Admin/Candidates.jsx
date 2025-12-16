// pages/Admin/Candidates.jsx
import React, { useState, useEffect } from "react";
import { Button, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import BackButton from "../../components/layout/BackButton";
import Tabs from "../../components/ui/Tabs";
import PageTitle from "../../components/ui/PageTitle";
import Pagination from "../../components/ui/Pagination";
import CSVUploadModal from "../../components/CSVUploadModal";
import FilterBar from "../../components/userManagement/FilterBar";
import UserTable from "../../components/userManagement/UserTable";
import usePagination from "../../hooks/usePagination";
import useUserManagement from "../../hooks/useUserManagement";
import useCSVOperations from "../../hooks/useCSVOperations";
import { candidateAPI, employerAPI, userAPI } from "../../services/api";

const Candidates = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  const [activeTab, setActiveTab] = useState("Candidates");
  const [filterBy, setFilterBy] = useState("Email ID");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [accountStatus, setAccountStatus] = useState(null);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Use user management hook
  const { users, isLoading, error, refetch: fetchUsers } = useUserManagement(
    activeTab,
    filterBy,
    searchQuery,
    selectedDate,
    verificationStatus,
    accountStatus,
    currentPage,
    pageSize,
    updateTotalItems
  );

  // Use CSV operations hook
  const {
    uploadStatus,
    isUploading,
    setUploadStatus,
    handleCSVUpload,
    handleExportCSV
  } = useCSVOperations(activeTab, searchQuery, filterBy, selectedDate, fetchUsers);

  // Reset pagination when filters change; reset page size to default when switching tab
  useEffect(() => {
    resetPagination();
    if (activeTab === "Candidates" || activeTab === "Employers" || activeTab === "Admins") {
      setPageSize(10);
    }
    // Clear status filters when filter type changes
    if (filterBy !== "Verification Status") {
      setVerificationStatus(null);
    }
    if (filterBy !== "Account Status") {
      setAccountStatus(null);
    }
    // Clear search query and date when tab changes
    setSearchQuery("");
    setSelectedDate(null);
  }, [activeTab, filterBy, resetPagination, setPageSize]);

  // Handle CSV export
  const handleExport = async () => {
    try {
      await handleExportCSV();
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  // Handle CSV upload with modal management
  const handleUpload = async (event) => {
    try {
      const response = await handleCSVUpload(event);
      // Close modal after 3 seconds if successful
      if (response?.results?.success?.length > 0) {
        setTimeout(() => {
          setIsCSVModalOpen(false);
          setUploadStatus(null);
        }, 3000);
      }
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  // Handle edit user
  const handleEdit = (userId) => {
    navigate(`/create-user?edit=${userId}`);
  };

  // Handle delete user
  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      // Determine which API to use based on active tab
      let api;
      let deleteMethod;
      
      if (activeTab === "Candidates") {
        api = candidateAPI;
        deleteMethod = api.delete;
      } else if (activeTab === "Employers") {
        api = employerAPI;
        deleteMethod = api.delete;
      } else if (activeTab === "Admins") {
        api = userAPI;
        // Use hard delete for admin users (complete deletion from DB)
        deleteMethod = api.hardDelete;
      } else {
        api = candidateAPI;
        deleteMethod = api.delete;
      }

      await deleteMethod(userToDelete);
      alert("User deleted successfully!");
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(error.response?.data?.message || "Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
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
          tabs={["Candidates", "Employers", "Admins"]}
          active={activeTab}
          setActive={setActiveTab}
          fullWidth
        />

        <FilterBar
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          verificationStatus={verificationStatus}
          setVerificationStatus={setVerificationStatus}
          accountStatus={accountStatus}
          setAccountStatus={setAccountStatus}
          onExport={handleExport}
        />

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

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
              <UserTable 
                users={users} 
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </div>

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
        }}
        onUpload={handleUpload}
        isUploading={isUploading}
        uploadStatus={uploadStatus}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Candidates;
