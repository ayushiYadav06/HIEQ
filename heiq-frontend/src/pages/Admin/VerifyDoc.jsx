import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import BackButton from "../../components/layout/BackButton";
import ProfileMiniNavbar from "../../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../../components/layout/ProfileCenterBox";
import Tabs from "../../components/ui/Tabs";
import DocumentSectionBox from "../../components/ui/DocumentSectionBox";
import UploadModal from "../../components/layout/UploadModal";
import { userAPI } from "../../services/api";
import { Spinner } from "react-bootstrap";
import UserImage from "../../assets/user.jpg";

const VerifyDoc = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [activeTab, setActiveTab] = useState("Verify Documents");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({}); // Track status changes before update

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      // userId from URL params is REQUIRED - don't use localStorage (that's the admin's data)
      if (!userId) {
        setIsLoading(false);
        setError("User ID not found in URL. Please navigate from a user profile.");
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const userData = await userAPI.getById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setError("Failed to load user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

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

  // Get profile image URL with cache-busting to show updated images
  const getProfileImageUrl = () => {
    if (user?.profileImage) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
      let imagePath = user.profileImage;
      if (imagePath.startsWith('uploads/')) {
        imagePath = imagePath.replace('uploads/', '');
      }
      // Add cache-busting query parameter using updatedAt timestamp to force browser reload
      const cacheBuster = user.updatedAt ? new Date(user.updatedAt).getTime() : Date.now();
      return `${baseUrl}/uploads/${imagePath}?t=${cacheBuster}`;
    }
    return UserImage;
  };

  // Handle tab redirect
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Always use userId from URL params (required)
    if (!userId) {
      alert("User ID not available. Please navigate from a user profile.");
      return;
    }
    
    if (tab === "Profile") {
      navigate(`/profile/${userId}`);
    }
    if (tab === "Account Settings") {
      navigate(`/Account-Setting/${userId}`);
    }
  };

  // Get user ID - always use userId from URL params (required)
  const getUserId = () => {
    if (!userId) {
      console.error("userId is required but not found in URL params");
      return null;
    }
    return userId;
  };

  // Handle document upload (supports multiple files)
  const handleUpload = async () => {
    const targetUserId = getUserId();
    if (!targetUserId) {
      alert("User ID not available");
      return;
    }

    // Check if files are selected
    const hasFiles = (uploadingDocType === "aadhar" && files.length > 0) || 
                     (uploadingDocType === "education" && files.length > 0) ||
                     (uploadingDocType === "aadhar" && file) ||
                     (uploadingDocType === "education" && file);

    if (!hasFiles || !uploadingDocType) {
      alert("Please select at least one file");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      
      if (uploadingDocType === "aadhar") {
        // Append multiple aadhar files
        if (files.length > 0) {
          files.forEach((f) => {
            formData.append("aadhar", f);
          });
        } else if (file) {
          formData.append("aadhar", file);
        }
      } else if (uploadingDocType === "education") {
        // Append multiple education files
        if (files.length > 0) {
          files.forEach((f) => {
            formData.append("degreeFile", f);
          });
        } else if (file) {
          formData.append("degreeFile", file);
        }
      }

      await userAPI.update(targetUserId, formData);
      
      // Refresh user data to show updated documents
      const updatedUser = await userAPI.getById(targetUserId);
      setUser(updatedUser);
      
      alert("Document(s) uploaded successfully");
      setOpenPopup(false);
      setFile(null);
      setFiles([]);
      setUploadingDocType(null);
    } catch (error) {
      console.error("Failed to upload document:", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle document status change (store in state, don't update yet)
  const handleStatusChange = (docType, index, newStatus) => {
    const key = `${docType}_${index}`;
    setStatusUpdates((prev) => ({
      ...prev,
      [key]: { docType, index, status: newStatus },
    }));
  };

  // Handle document view
  const handleView = (filePath) => {
    if (!filePath) {
      alert("No document available");
      return;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    let docPath = filePath;
    if (docPath.startsWith('uploads/')) {
      docPath = docPath.replace('uploads/', '');
    }
    window.open(`${baseUrl}/uploads/${docPath}`, '_blank');
  };

  // Handle document download
  const handleDownload = (filePath) => {
    handleView(filePath); // Same as view for now
  };

  // Handle document update (save status to backend)
  const handleUpdate = async (docType, index) => {
    const targetUserId = getUserId();
    if (!targetUserId) return;
    
    const key = `${docType}_${index}`;
    const statusUpdate = statusUpdates[key];
    
    if (!statusUpdate) {
      alert("Please select a status first");
      return;
    }

    setIsProcessing(true);
    try {
      // Call API to update document status
      await userAPI.updateDocumentStatus(
        targetUserId,
        docType,
        statusUpdate.status,
        docType === "education" ? index : null
      );
      
      // Refresh user data to show updated status
      const updatedUser = await userAPI.getById(targetUserId);
      setUser(updatedUser);
      
      // Remove from statusUpdates
      setStatusUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[key];
        return newUpdates;
      });
      
      alert("Document status updated successfully");
    } catch (error) {
      console.error("Failed to update document status:", error);
      alert(error.response?.data?.message || "Failed to update document status. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Prepare document items
  const getAadharItems = () => {
    if (!user?.aadharFile) return [];
    const statusKey = "aadhar_0";
    const pendingStatus = statusUpdates[statusKey]?.status;
    const currentStatus = pendingStatus || user.aadharStatus || "Pending";
    
    return [{
      documentName: "Aadhar",
      uploadedDate: formatDate(user.updatedAt || user.createdAt),
      status: currentStatus,
      onStatusChange: (e) => handleStatusChange("aadhar", 0, e.target.value),
      onView: () => handleView(user.aadharFile),
      onDownload: () => handleDownload(user.aadharFile),
      onUpdate: () => handleUpdate("aadhar", 0),
    }];
  };

  const getEducationItems = () => {
    if (!user?.education || user.education.length === 0) return [];
    return user.education.map((edu, index) => {
      const statusKey = `education_${index}`;
      const pendingStatus = statusUpdates[statusKey]?.status;
      const currentStatus = pendingStatus || edu.status || "Pending";
      
      return {
        documentName: edu.degree || `Education ${index + 1}`,
        uploadedDate: formatDate(user.updatedAt || user.createdAt),
        status: currentStatus,
        onStatusChange: (e) => handleStatusChange("education", index, e.target.value),
        onView: () => handleView(edu.degreeFile),
        onDownload: () => handleDownload(edu.degreeFile),
        onUpdate: () => handleUpdate("education", index),
      };
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <BackButton label="Back" />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <BackButton label="Back" />
        <div className="alert alert-danger mt-4">{error || "User not found"}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <BackButton label="Back" />

      {/* PROFILE TOP SECTION */}
      <div className="position-relative mt-3" style={{ paddingBottom: "120px" }}>
        <ProfileMiniNavbar
          email={user.email || "N/A"}
          phone={user.phone || user.contact || "N/A"}
          joinedDate={formatDate(user.createdAt)}
          lastSeen={user.updatedAt ? formatDate(user.updatedAt) : "N/A"}
        />

        {/* CENTER BOX - Properly Centered */}
        <div
          className="position-absolute"
          style={{
            top: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "1260px",
          }}
        >
          <ProfileCenterBox
            profileImage={getProfileImageUrl()}
            name={user.name?.toUpperCase() || "N/A"}
            hideButton
          />
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="mt-5">
        <Tabs
          active={activeTab}
          setActive={handleTabChange}
          tabs={["Profile", "Account Settings", "Verify Documents"]}
        />
      </div>

      {/* DOCUMENT SECTIONS */}
      <div className="mt-4">
        {/* ID Proof */}
        <DocumentSectionBox
          title="ID Proof"
          onUploadNew={() => {
            setUploadingDocType("aadhar");
            setFile(null);
            setFiles([]);
            setOpenPopup(true);
          }}
          items={getAadharItems()}
        />

        {/* Education */}
        <DocumentSectionBox
          title="Education"
          onUploadNew={() => {
            setUploadingDocType("education");
            setFile(null);
            setFiles([]);
            setOpenPopup(true);
          }}
          items={getEducationItems()}
        />
      </div>

      {/* UPLOAD MODAL */}
      <UploadModal
        open={openPopup}
        onClose={() => {
          setOpenPopup(false);
          setFile(null);
          setFiles([]);
          setUploadingDocType(null);
        }}
        file={file}
        setFile={setFile}
        files={files}
        setFiles={setFiles}
        onUpload={handleUpload}
        isProcessing={isProcessing}
        allowMultiple={true}
      />
    </AdminLayout>
  );
};

export default VerifyDoc;
