import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TopNavbar from "../components/layout/TopNavbar";
import BackButton from "../components/layout/BackButton";
import ProfileMiniNavbar from "../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../components/layout/ProfileCenterBox";
import Tabs from "../components/ui/Tabs";

import AccountStatusBox from "../components/ui/AccountStatusBox";
import ChangePasswordBox from "../components/ui/ChangePasswordBox";
import ResetPasswordBox from "../components/ui/ResetPasswordBox";
import EmailVerificationBox from "../components/ui/EmailVerificationBox";

import UserImage from "../assets/user.jpg";

const AccountSetting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Account Settings");

  // ⭐ TAB REDIRECT
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "Profile") navigate("/profile");
    if (tab === "Verify Documents") navigate("/Verify-Documents");
  };

  return (
    <>
      <TopNavbar />

      <Container fluid className="mt-3 px-0">

        <div className="d-flex justify-content-end pe-3">
          <BackButton text="Back" />
        </div>

        {/* PROFILE MINI NAV + BOX */}
        <div className="position-relative mt-3" style={{ paddingBottom: "120px" }}>
          <ProfileMiniNavbar
            email="nivedp@gmail.com"
            phone="1234567890"
            joinedDate="20th May 2023"
            lastSeen="25 mins ago"
          />

          <div className="position-absolute start-50 translate-middle-x" style={{ top: "-30px" }}>
            <ProfileCenterBox profileImage={UserImage} name="NIVED P K" hideButton />
          </div>
        </div>

        {/* TABS */}
        <Container fluid className="px-4 mt-5">
          <Tabs
            active={activeTab}
            setActive={handleTabChange}
            tabs={["Profile", "Account Settings", "Verify Documents"]}
          />
        </Container>

        {/* ACCOUNT SETTINGS BOXES */}
        <Container fluid className="px-4 mt-4">

          <AccountStatusBox
            status="Active"
            onDeactivate={() => alert("Deactivate User")}
            onDelete={() => alert("Delete User")}
          />

          <ChangePasswordBox onChangePassword={() => alert("Password Changed")} />

          <ResetPasswordBox onResetPassword={() => alert("Reset Link Sent")} />

          <EmailVerificationBox onVerifyEmail={() => alert("Verification Link Sent")} />

        </Container>
      </Container>
    </>
  );
};

export default AccountSetting;
