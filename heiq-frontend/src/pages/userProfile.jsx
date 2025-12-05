import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../components/layout/TopNavbar.jsx";
import BackButton from "../components/layout/BackButton.jsx";
import ProfileMiniNavbar from "../components/layout/ProfileMiniNavbar.jsx";
import ProfileCenterBox from "../components/layout/ProfileCenterBox.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import PersonalInformationBox from "../components/ui/PersonalInformationBox.jsx";
import UserImage from "../assets/user.jpg";
import { Container } from "react-bootstrap";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    dob: "",
    summary: "",
  });

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // ⭐ TAB HANDLER
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "Account Settings") navigate("/Account-Setting");
    if (tab === "Verify Documents") navigate("/Verify-Documents");
  };

  return (
    <>
      <TopNavbar />

      <Container fluid className="mt-3 px-0">
        <div className="d-flex justify-content-end pe-3">
          <BackButton text="Back" />
        </div>

        {/* TOP PROFILE INFO */}
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

        {/* TABS */}
        <Container fluid className="px-4 mt-5">
          <Tabs
            active={activeTab}
            setActive={handleTabChange}
            tabs={["Profile", "Account Settings", "Verify Documents"]}
          />
        </Container>

        {/* PERSONAL INFORMATION */}
        <Container fluid className="px-4">
          <PersonalInformationBox
            profileImage={UserImage}
            values={formValues}
            onChange={handleChange}
            onUpload={() => alert("Upload clicked")}
          />
        </Container>
      </Container>
    </>
  );
};

export default UserProfile;
