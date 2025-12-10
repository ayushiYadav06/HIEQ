import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar";
import BackButton from "../../components/layout/BackButton";
import ProfileMiniNavbar from "../../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../../components/layout/ProfileCenterBox";
import Tabs from "../../components/ui/Tabs";

import AccountStatusBox from "../../components/ui/AccountStatusBox";
import ChangePasswordBox from "../../components/ui/ChangePasswordBox";
import ResetPasswordBox from "../../components/ui/ResetPasswordBox";
import EmailVerificationBox from "../../components/ui/EmailVerificationBox";

import UserImage from "../../assets/user.jpg";

const AccountSetting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Account Settings");

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle tab redirect
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "Profile") navigate("/profile");
    if (tab === "Verify Documents") navigate("/Verify-Documents");
  };

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* TOP NAVBAR */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* PAGE WRAPPER */}
      <Container fluid className="mt-3 px-0">

        {/* BACK BUTTON */}
        <div
          style={{
            marginTop: "1rem",
            paddingLeft: "5px",      // ⭐ Content starts after sidebar
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <BackButton label="Back" />
        </div>

        {/* MINI NAVBAR + FLOATING PROFILE BOX */}
        <div
          className="position-relative mt-3"
          style={{ paddingBottom: "120px" }}
        >
          <ProfileMiniNavbar
            email="nivedp@gmail.com"
            phone="1234567890"
            joinedDate="20th May 2023"
            lastSeen="25 mins ago"
          />

          <div
            className="position-absolute start-50 translate-middle-x"
            style={{ top: "-30px" }}
          >
            <ProfileCenterBox
              profileImage={UserImage}
              name="NIVED P K"
              hideButton
            />
          </div>
        </div>

        {/* TABS ROW - aligned with sidebar */}
        <Container
          fluid
          className="mt-5"
          style={{ paddingLeft: "210px", paddingRight: "20px" }}
        >
          <Tabs
            active={activeTab}
            setActive={handleTabChange}
            tabs={["Profile", "Account Settings", "Verify Documents"]}
          />
        </Container>

        {/* ACCOUNT SETTING BOXES - aligned with sidebar */}
        <Container
          fluid
          className="mt-4"
          style={{ paddingLeft: "210px", paddingRight: "20px" }}
        >
          <AccountStatusBox
            status="Active"
            onDeactivate={() => alert("Deactivate User")}
            onDelete={() => alert("Delete User")}
          />

          <ChangePasswordBox
            onChangePassword={() => alert("Password Changed")}
          />

          <ResetPasswordBox onResetPassword={() => alert("Reset Link Sent")} />

          <EmailVerificationBox
            onVerifyEmail={() => alert("Verification Link Sent")}
          />
        </Container>

      </Container>
    </>
  );
};

export default AccountSetting;
