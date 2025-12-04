import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TopNavbar from "../components/layout/TopNavbar";
import BackButton from "../components/layout/BackButton";
import ProfileMiniNavbar from "../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../components/layout/ProfileCenterBox";
import Tabs from "../components/ui/Tabs";
import DocumentSectionBox from "../components/ui/DocumentSectionBox";

import UploadModal from "../components/Layout/UploadModal.jsx";  // ⬅ added
import UserImage from "../assets/user.jpg";

const VerifyDoc = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Verify Documents");

  // ===== Upload Modal States =====
  const [openPopup, setOpenPopup] = useState(false);
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    alert(`Uploading: ${file.name}`);
    setOpenPopup(false);
    setFile(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "Profile") navigate("/User-Profile");
    if (tab === "Account Settings") navigate("/Account-Setting");
  };

  return (
    <>
      <TopNavbar />

      <Container fluid className="mt-3 px-0">

        {/* BACK BUTTON */}
        <div className="d-flex justify-content-end pe-3">
          <BackButton text="Back" />
        </div>

        {/* MINI NAV + CENTER PROFILE CARD */}
        <div className="position-relative mt-3" style={{ paddingBottom: "120px" }}>
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

        {/* TABS */}
        <Container fluid className="px-4 mt-5">
          <Tabs
            active={activeTab}
            setActive={handleTabChange}
            tabs={["Profile", "Account Settings", "Verify Documents"]}
          />
        </Container>

        {/* DOCUMENT SECTIONS */}
        <Container fluid className="px-4 mt-4">

          {/* ID Proof */}
          <DocumentSectionBox
            title="ID Proof"
            onUploadNew={() => setOpenPopup(true)}   // ⬅ popup opens
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
            onUploadNew={() => setOpenPopup(true)}   // ⬅ popup opens
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
            onUploadNew={() => setOpenPopup(true)}   // ⬅ popup opens
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

      {/* ===== UPLOAD POPUP MODAL ===== */}
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
