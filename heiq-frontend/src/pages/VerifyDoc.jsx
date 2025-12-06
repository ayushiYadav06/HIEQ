import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TopNavbar from "../components/layout/TopNavbar";
import BackButton from "../components/layout/BackButton";
import ProfileMiniNavbar from "../components/layout/ProfileMiniNavbar";
import ProfileCenterBox from "../components/layout/ProfileCenterBox";
import Tabs from "../components/ui/Tabs";
import DocumentSectionBox from "../components/ui/DocumentSectionBox";

import UploadModal from "../components/layout/UploadModal.jsx";  
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

      <Container fluid className="px-0">

        {/* BACK BUTTON */}
        <Container fluid className="px-3 px-md-4 mt-3">
          <Row>
            <Col xs={12} className="d-flex justify-content-end">
              <BackButton text="Back" />
            </Col>
          </Row>
        </Container>

        {/* MINI NAV + CENTER PROFILE CARD */}
        <Container fluid className="px-3 px-md-4 mt-3">
          <Row>
            <Col xs={12}>
              <div className="position-relative" style={{ paddingBottom: "80px" }}>
                <ProfileMiniNavbar
                  email="nivedp@gmail.com"
                  phone="1234567890"
                  joinedDate="20th May 2023"
                  lastSeen="25 mins ago"
                />

                <div
                  className="position-absolute start-50 translate-middle-x"
                  style={{ top: "50px" }}
                >
                  <ProfileCenterBox
                    profileImage={UserImage}
                    name="NIVED P K"
                    hideButton={true}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        {/* TABS */}
        <Container fluid className="px-3 px-md-4 mt-4">
          <Row>
            <Col xs={12}>
              <Tabs
                active={activeTab}
                setActive={handleTabChange}
                tabs={["Profile", "Account Settings", "Verify Documents"]}
              />
            </Col>
          </Row>
        </Container>

        {/* DOCUMENT SECTIONS */}
        <Container fluid className="px-3 px-md-4 mt-4 mb-5">
          <Row>
            <Col xs={12}>

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

            </Col>
          </Row>
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