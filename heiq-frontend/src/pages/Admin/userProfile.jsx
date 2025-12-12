import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import BackButton from "../../components/layout/BackButton";
import ProfileMiniNavbar from "../../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../../components/layout/ProfileCenterBox";
import Tabs from "../../components/ui/Tabs";
import PersonalInformationBox from "../../components/ui/PersonalInformationBox";
import { userAPI } from "../../services/api";
import { Card, Row, Col, Badge, Spinner, Table } from "react-bootstrap";
import UserImage from "../../assets/user.jpg";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ⭐ NEW FIX: Forces image re-render
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const profileImageInputRef = React.useRef(null);

  // ⭐ Instant Preview (until upload completes)
  const [localPreview, setLocalPreview] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const userData = await userAPI.getById(userId);
        setUser(userData);

        // ⭐ Every time user loads, force refresh
        setImageRefreshKey(Date.now());
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setError("Failed to load user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const getRoleBadgeColor = (role) => {
    const roleColors = {
      ADMIN: "danger",
      EMPLOYER: "info",
      STUDENT: "success",
      CONTENT_ADMIN: "warning",
      SUPPORT_ADMIN: "warning",
    };
    return roleColors[role] || "secondary";
  };

  const handleTabChange = (tab) => {
    const id = userId || user?._id;

    if (!id) return;

    if (tab === "Account Settings") return navigate(`/Account-Setting/${id}`);
    if (tab === "Verify Documents") return navigate(`/Verify-Documents/${id}`);

    setActiveTab(tab);
  };

  // ⭐ Generate Correct Image URL
  const getProfileImageUrl = () => {
    if (localPreview) return localPreview;

    if (user?.profileImage) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

      // ⭐ ADD random UUID + timestamp to bust cache
      return `${baseUrl}/uploads/${user.profileImage}?refresh=${imageRefreshKey}`;
    }

    return UserImage;
  };

  // ⭐ IMAGE UPLOAD FIX
  const handleProfileImageUpload = async (file) => {
    if (!file || !user?._id) return;

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      await userAPI.update(user._id, formData);

      // Fetch updated user
      const updatedUser = await userAPI.getById(user._id);
      setUser(updatedUser);

      // ⭐ Force both images to refresh
      setImageRefreshKey(Date.now());

      // ⭐ Clear preview only after backend confirms update
      setLocalPreview(null);

      alert("Profile image updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert("Invalid image type"); return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Max size 5MB"); return;
    }

    // ⭐ Instant Preview
    setLocalPreview(URL.createObjectURL(file));

    // Upload to Backend
    handleProfileImageUpload(file);

    if (profileImageInputRef.current) profileImageInputRef.current.value = "";
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <BackButton label="Back" />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
          <Spinner animation="border" />
        </div>
      </AdminLayout>
    );
  }

  const formValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    summary: user?.summary || "",
  };

  return (
    <AdminLayout>
      <BackButton label="Back" />

      {/* TOP */}
      <div className="position-relative mt-3" style={{ paddingBottom: 120 }}>
        <ProfileMiniNavbar
          email={user.email}
          phone={user.phone}
          joinedDate={formatDate(user.createdAt)}
          lastSeen={formatDate(user.updatedAt)}
        />

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
            name={user.name?.toUpperCase()}
            hideButton
          />
        </div>
      </div>

      {/* TABS */}
      <div className="mt-5">
        <Tabs
          active={activeTab}
          setActive={handleTabChange}
          tabs={["Profile", "Account Settings", "Verify Documents"]}
        />
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        <input
          type="file"
          ref={profileImageInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageFileSelect}
        />

        <PersonalInformationBox
          profileImage={getProfileImageUrl()}
          values={formValues}
          onChange={() => {}}
          onUpload={() => profileImageInputRef.current?.click()}
        />

        {isUploadingImage && (
          <div className="text-center mt-2">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">Uploading...</span>
          </div>
        )}

        {/* REST OF YOUR CARDS (education, experience, skills etc...) */}
      </div>
    </AdminLayout>
  );
};

export default UserProfile;
