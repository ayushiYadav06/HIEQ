import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TopNavbar from "../../components/layout/TopNavbar.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import BackButton from "../../components/layout/BackButton.jsx";
import ProfileMiniNavbar from "../../components/layout/ProfileMiniNavbar.jsx";
import ProfileCenterBox from "../../components/layout/ProfileCenterBox.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import DocumentSectionBox from "../../components/ui/DocumentSectionBox.jsx";

import UploadModal from "../../components/layout/UploadModal.jsx";
import UserImage from "../../assets/user.jpg";

const VerifyDoc = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Verify Documents");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openPopup, setOpenPopup] = useState(false);
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    alert(`Uploading: ${file?.name}`);
    setOpenPopup(false);
    setFile(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Profile") navigate("/Profile");
    if (tab === "Account Settings") navigate("/Account-Setting");
  };

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* TOP NAVBAR */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      <Container fluid className="mt-3 px-0">

        {/* BACK BUTTON — aligned with sidebar */}
        <div
          style={{
            marginTop: "1rem",
            paddingLeft: "10px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <BackButton label="Back" />
        </div>

        {/* MINI NAV + PROFILE */}
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
              hideButton={true}
            />
          </div>
        </div>

        {/* TABS — aligned with sidebar */}
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

        {/* DOCUMENT SECTIONS — aligned with sidebar */}
        <Container
          fluid
          className="mt-4 mb-5"
          style={{ paddingLeft: "210px", paddingRight: "20px" }}
        >
          {/* ID Proof */}
          <DocumentSectionBox
            title="ID Proof"
            onUploadNew={() => setOpenPopup(true)}
            items={[
              {
                documentName: "Aadhar",
                uploadedDate: "20-12-2022",
                status: "Approve",
                onStatusChange: () => {},
                onView: () => alert("View Aadhar"),
                onDownload: () => alert("Download Aadhar"),
                onUpdate: () => alert("ID Proof Updated"),
              },
            ]}
          />

          {/* Education */}
          <DocumentSectionBox
            title="Education"
            onUploadNew={() => setOpenPopup(true)}
            items={[
              {
                documentName: "BTech",
                uploadedDate: "20-12-2022",
                status: "Reject",
                onStatusChange: () => {},
                onView: () => alert("View BTech"),
                onDownload: () => alert("Download BTech"),
                onUpdate: () => alert("Education Updated"),
              },
            ]}
          />

          {/* Work Experience */}
          <DocumentSectionBox
            title="Work Experience"
            onUploadNew={() => setOpenPopup(true)}
            items={[
              {
                documentName: "Software Intern",
                uploadedDate: "20-12-2022",
                status: "Approve",
                onStatusChange: () => {},
                onView: () => alert("View Work Experience"),
                onDownload: () => alert("Download Work Experience"),
                onUpdate: () => alert("Work Experience Updated"),
              },
            ]}
          />
        </Container>
      </Container>

      {/* UPLOAD MODAL */}
      <UploadModal
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        file={file}
        setFile={setFile}
        onUpload={handleUpload}
      />
    </>
  );
};

export default VerifyDoc;
