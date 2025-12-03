import React, { useState } from "react";
import TopNavbar from "../components/layout/TopNavbar";
import BackButton from "../components/layout/BackButton";
import ProfileMiniNavbar from "../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../components/layout/ProfileCenterBox";
import Tabs from "../components/ui/Tabs.jsx";
import PersonalInformationBox from "../components/ui/PersonalInformationBox";
import UserImage from "../assets/user.jpg";
import { Container } from "react-bootstrap";

const UserProfile = () => {
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

  return (
    <>
      <TopNavbar />

      <Container fluid className="mt-3 px-0">
        <div className="d-flex justify-content-end pe-3">
          <BackButton text="Back" />
        </div>

        {/* MINI NAV + PROFILE IMAGE */}
        <div className="position-relative mt-3" style={{ paddingBottom: "120px" }}>
          <ProfileMiniNavbar
            email="nivedp@gmail.com"
            phone="1234567890"
            joinedDate="20th May 2023"
            lastSeen="25 mins ago"
          />

          {/* CENTER PROFILE BOX */}
          <div
            className="position-absolute start-50 translate-middle-x"
            style={{ top: "-30px" }}
          >
            <ProfileCenterBox
              profileImage={UserImage}
              name="NIVED P K"
              hideButton={true}
            />
          </div>
        </div>

        {/* TABS */}
        <Container fluid className="px-4 mt-5">
          <Tabs
            active={activeTab}
            setActive={setActiveTab}
            tabs={["Profile", "Account Settings", "Verify Documents"]}
          />
        </Container>

        {/* PERSONAL INFORMATION BOX */}
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
