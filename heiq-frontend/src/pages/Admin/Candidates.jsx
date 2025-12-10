// pages/Admin/Candidates.jsx
import React, { useState, useRef } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TopNavbar from "../../components/layout/TopNavbar";
import Sidebar from "../../components/layout/Sidebar";
import BackButton from "../../components/layout/BackButton";
import Tabs from "../../components/ui/Tabs";
import SearchInput from "../../components/ui/SearchInput";
import DateTabs from "../../components/ui/DateTabs";
import PageTitle from "../../components/ui/PageTitle";
import ExportButton from "../../components/ui/ExportButton";
import FilterDropdown from "../../components/ui/FilterDropdown";
import DataTable from "../../components/ui/DataTable";
import { userAPI } from "../../services/api";

const Candidates = () => {
  const [activeTab, setActiveTab] = useState("Candidates");
  const [filterBy, setFilterBy] = useState("Email ID");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const columns = [
    "Name",
    "Email ID",
    "Phone",
    "Verification Status",
    "Account Status",
    "Registered on",
  ];

  const candidateData = [
    {
      Name: "Aman Garg",
      "Email ID": "aman@gmail.com",
      Phone: "1234567890",
      "Verification Status": <span style={{ color: "green" }}>Verified</span>,
      "Account Status": "Active",
      "Registered on": "20-12-2022",
    },
    {
      Name: "Nived PK",
      "Email ID": "nived@gmail.com",
      Phone: "1234567890",
      "Verification Status": <span style={{ color: "green" }}>Verified</span>,
      "Account Status": "Active",
      "Registered on": "20-12-2022",
    },
  ];

  const employerData = [];
  const rows = activeTab === "Candidates" ? candidateData : employerData;

  // CSV Parser function
  const parseCSV = (csvText) => {
    const lines = csvText.split("\n").filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error("CSV file must have at least a header and one data row");
    }

    // Parse header
    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().replace(/"/g, ""));
    
    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = [];
      let currentValue = "";
      let inQuotes = false;

      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim());

      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        data.push(row);
      }
    }

    return data;
  };

  // Transform CSV data to API format
  const transformCSVToUserData = (csvData, userType) => {
    return csvData.map((row) => {
      const userData = {
        fullName: row["Full Name"] || row["fullName"] || row["Name"] || "",
        email: row["Email"] || row["email"] || row["Email ID"] || "",
        password: row["Password"] || row["password"] || "DefaultPassword123!",
        contact: row["Contact"] || row["contact"] || row["Phone"] || "",
        gender: row["Gender"] || row["gender"] || "",
        dob: row["Date of Birth"] || row["DOB"] || row["dob"] || "",
        summary: row["Summary"] || row["summary"] || row["Profile Summary"] || "",
        role: userType === "Candidates" ? "STUDENT" : "EMPLOYER",
      };

      // Parse education (format: "Degree|University|Year" or JSON)
      if (userType === "Candidates") {
        const educationStr = row["Education"] || row["education"] || "";
        if (educationStr) {
          try {
            // Try parsing as JSON first
            userData.education = JSON.parse(educationStr);
          } catch {
            // If not JSON, try pipe-separated format
            const eduEntries = educationStr.split(";").filter((e) => e.trim());
            userData.education = eduEntries.map((entry) => {
              const parts = entry.split("|").map((p) => p.trim());
              return {
                degree: parts[0] || "",
                university: parts[1] || "",
                year: parts[2] || "",
              };
            });
          }
        }

        // Parse experience (format: "Company|Role|Years" or JSON)
        const experienceStr = row["Experience"] || row["experience"] || "";
        if (experienceStr) {
          try {
            userData.experience = JSON.parse(experienceStr);
          } catch {
            const expEntries = experienceStr.split(";").filter((e) => e.trim());
            userData.experience = expEntries.map((entry) => {
              const parts = entry.split("|").map((p) => p.trim());
              return {
                company: parts[0] || "",
                role: parts[1] || "",
                years: parts[2] || "",
              };
            });
          }
        }
      } else {
        // Employer fields
        const skillsStr = row["Skills"] || row["skills"] || "";
        if (skillsStr) {
          userData.skills = skillsStr.split(",").map((s) => s.trim()).filter((s) => s);
        }

        const companyExpStr = row["Company Experience"] || row["companyExperience"] || "";
        if (companyExpStr) {
          try {
            userData.companyExperience = JSON.parse(companyExpStr);
          } catch {
            const expEntries = companyExpStr.split(";").filter((e) => e.trim());
            userData.companyExperience = expEntries.map((entry) => {
              const parts = entry.split("|").map((p) => p.trim());
              return {
                company: parts[0] || "",
                role: parts[1] || "",
                years: parts[2] || "",
              };
            });
          }
        }
      }

      return userData;
    });
  };

  // Handle CSV file upload
  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setUploadStatus({
        type: "danger",
        message: "Please upload a CSV file",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const fileText = await file.text();
      const csvData = parseCSV(fileText);
      
      if (csvData.length === 0) {
        throw new Error("CSV file is empty or invalid");
      }

      const userType = activeTab === "Candidates" ? "Candidates" : "Employers";
      const transformedData = transformCSVToUserData(csvData, userType);

      // Send to backend
      const response = await userAPI.bulkCreate(transformedData);

      setUploadStatus({
        type: "success",
        message: `Successfully uploaded ${response.results.success.length} users. ${response.results.failed.length} failed.`,
        details: response.results,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Optionally refresh the page or reload data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("CSV upload error:", error);
      let errorMessage = "Failed to upload CSV file";
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = "Cannot connect to backend server. Please make sure the backend server is running on port 4000.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setUploadStatus({
        type: "danger",
        message: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCSVButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Top Navbar */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Back Button */}
      <Container fluid className="mt-4 px-1">
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <BackButton label="Back" />
        </div>
      </Container>

      {/* Main Content */}
      <div style={{ paddingLeft: "215px", paddingRight: "20px", marginTop: "20px" }}>
        
        {/* Title + Create Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <PageTitle title="Users List" />

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleCSVUpload}
              style={{ display: "none" }}
            />
            <Button
              variant="success"
              onClick={handleCSVButtonClick}
              disabled={isUploading}
              style={{
                background: "#28a745",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                borderRadius: "4px",
                cursor: isUploading ? "not-allowed" : "pointer",
              }}
            >
              {isUploading ? "Uploading..." : "📄 Upload CSV"}
            </Button>
            <button
              className="create-btn"
              onClick={() => navigate("/create-user")}
              style={{
                background: "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <span className="plus">+</span> Create User
            </button>
          </div>
        </div>

        {/* Upload Status Alert */}
        {uploadStatus && (
          <Alert
            variant={uploadStatus.type}
            dismissible
            onClose={() => setUploadStatus(null)}
            className="mb-4"
          >
            <Alert.Heading>
              {uploadStatus.type === "success" ? "Upload Successful!" : "Upload Failed"}
            </Alert.Heading>
            <p>{uploadStatus.message}</p>
            {uploadStatus.details && uploadStatus.details.failed.length > 0 && (
              <div className="mt-3">
                <strong>Failed entries:</strong>
                <ul className="mb-0">
                  {uploadStatus.details.failed.slice(0, 5).map((fail, idx) => (
                    <li key={idx}>
                      {fail.email}: {fail.reason}
                    </li>
                  ))}
                  {uploadStatus.details.failed.length > 5 && (
                    <li>... and {uploadStatus.details.failed.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}
          </Alert>
        )}

        {/* Tabs */}
        <div className="mb-4">
          <Tabs
            tabs={["Candidates", "Employers"]}
            active={activeTab}
            setActive={setActiveTab}
            fullWidth
          />
        </div>

        {/* Filter Bar */}
        <Row className="g-3 align-items-center mb-4">
          <Col xs={12} md={6} lg={2}>
            <ExportButton />
          </Col>

          <Col xs={12} md={6} lg={4}>
            <SearchInput placeholder="Enter search here..." />
          </Col>

          <Col xs={12} md={6} lg={3}>
            <FilterDropdown value={filterBy} setValue={setFilterBy} />
          </Col>

          <Col xs={12} md={6} lg={3}>
            <DateTabs />
          </Col>
        </Row>

        {/* Table */}
        <DataTable
          columns={columns}
          rows={rows}
          headerColor="#666666"
          headerBg="#D9D9D95C"
        />
      </div>
    </>
  );
};

export default Candidates;
