import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import BackButton from "../../components/layout/BackButton";
import ProfileMiniNavbar from "../../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../../components/layout/ProfileCenterBox";
import Tabs from "../../components/ui/Tabs";
import AccountStatusBox from "../../components/ui/AccountStatusBox";
import ChangePasswordBox from "../../components/ui/ChangePasswordBox";
import ResetPasswordBox from "../../components/ui/ResetPasswordBox";
import EmailVerificationBox from "../../components/ui/EmailVerificationBox";
import { userAPI } from "../../services/api";
import { Spinner } from "react-bootstrap";
import UserImage from "../../assets/user.jpg";

const AccountSetting = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [activeTab, setActiveTab] = useState("Account Settings");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (tab === "Verify Documents") {
      navigate(`/Verify-Documents/${userId}`);
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

  // Handle deactivate user
  const handleDeactivate = async () => {
    const targetUserId = getUserId();
    if (!targetUserId) return;
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;

    setIsProcessing(true);
    try {
      await userAPI.block(targetUserId);
      // Refresh user data
      const updatedUser = await userAPI.getById(targetUserId);
      setUser(updatedUser);
      alert("User deactivated successfully");
    } catch (error) {
      console.error("Failed to deactivate user:", error);
      alert("Failed to deactivate user. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle activate user
  const handleActivate = async () => {
    const targetUserId = getUserId();
    if (!targetUserId) return;
    if (!window.confirm("Are you sure you want to activate this user?")) return;

    setIsProcessing(true);
    try {
      await userAPI.unblock(targetUserId);
      // Refresh user data
      const updatedUser = await userAPI.getById(targetUserId);
      setUser(updatedUser);
      alert("User activated successfully");
    } catch (error) {
      console.error("Failed to activate user:", error);
      alert("Failed to activate user. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle delete user
  const handleDelete = async () => {
    const targetUserId = getUserId();
    if (!targetUserId) return;
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    setIsProcessing(true);
    try {
      await userAPI.delete(targetUserId);
      alert("User deleted successfully");
      navigate("/admin/candidates");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle change password
  const handleChangePassword = async (newPassword, confirmPassword) => {
    const targetUserId = getUserId();
    if (!targetUserId) return;

    setIsProcessing(true);
    try {
      await userAPI.changePassword(targetUserId, newPassword, confirmPassword);
      alert("Password changed successfully");
      // Refresh user data
      const updatedUser = await userAPI.getById(targetUserId);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to change password:", error);
      alert(error.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    const targetUserId = getUserId();
    if (!targetUserId) return;
    if (!window.confirm(`Send password reset link to ${user?.email || 'user'}'s email?`)) return;

    setIsProcessing(true);
    try {
      await userAPI.sendPasswordResetEmail(targetUserId);
      alert("Password reset email sent successfully");
      // Refresh user data
      const updatedUser = await userAPI.getById(targetUserId);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to send reset email:", error);
      alert(error.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle email verification
  const handleVerifyEmail = async () => {
    const targetUserId = getUserId();
    if (!targetUserId) return;
    if (!window.confirm(`Send verification link to ${user?.email || 'user'}'s email?`)) return;

    setIsProcessing(true);
    try {
      await userAPI.sendEmailVerificationLink(targetUserId);
      alert("Verification email sent successfully");
      // Refresh user data to get updated emailVerified status
      const updatedUser = await userAPI.getById(targetUserId);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      alert(error.response?.data?.message || "Failed to send verification email. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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

  const accountStatus = user.deleted
    ? "Deleted"
    : user.blocked
    ? "Inactive"
    : "Active";

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

      {/* ACCOUNT SETTING BOXES */}
      <div className="mt-4">
        <AccountStatusBox
          status={accountStatus}
          email={user.email}
          onDeactivate={user.blocked ? handleActivate : handleDeactivate}
          onDelete={handleDelete}
          isProcessing={isProcessing}
        />

        <ChangePasswordBox
          onChangePassword={handleChangePassword}
          isProcessing={isProcessing}
        />

        <ResetPasswordBox
          onResetPassword={handleResetPassword}
          isProcessing={isProcessing}
        />

        <EmailVerificationBox
          onVerifyEmail={handleVerifyEmail}
          isVerified={user.emailVerified}
          isProcessing={isProcessing}
        />
      </div>
    </AdminLayout>
  );
};

export default AccountSetting;
