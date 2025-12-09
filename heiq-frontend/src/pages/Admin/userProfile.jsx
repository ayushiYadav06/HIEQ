import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../../components/layout/TopNavbar.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import BackButton from "../../components/layout/BackButton.jsx";
import ProfileMiniNavbar from "../../components/layout/ProfileMiniNavbar.jsx";
import ProfileCenterBox from "../../components/layout/ProfileCenterBox.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import PersonalInformationBox from "../../components/ui/PersonalInformationBox.jsx";
import UserImage from "../../assets/user.jpg";
import { Container, Row, Col } from "react-bootstrap";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Tab Navigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "Account Settings") navigate("/Account-Setting");
    if (tab === "Verify Documents") navigate("/Verify-Documents");
  };

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* TOP NAVBAR */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* MAIN PAGE CONTENT STARTS FROM SIDEBAR END */}
      <Container fluid className="px-0" style={{ paddingLeft: "210px" }}>
        {/* BACK BUTTON */}
        <div className="mt-3 ps-3">
          <BackButton label="Back" />
        </div>

        {/* PROFILE TOP SECTION */}
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

          {/* CENTER BOX — perfectly centered */}
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

        {/* TABS SECTION */}
<Container
  fluid
  className="mt-5"
  style={{ paddingLeft: "200px", paddingRight: "20px" }}
>
  <Tabs
    active={activeTab}
    setActive={handleTabChange}
    tabs={["Profile", "Account Settings", "Verify Documents"]}
  />
</Container>


        {/* PERSONAL INFORMATION BOX — CENTER MIDDLE AREA */}
        <Container
          fluid
          className="px-4"
          style={{ maxWidth: "1330px", marginLeft: "200px" }} // ⭐ middle content width
        >
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
