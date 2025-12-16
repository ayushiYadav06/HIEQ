import { useState } from "react";
import { candidateAPI, employerAPI, userAPI } from "../services/api";

const useCSVOperations = (activeTab, searchQuery, filterBy, selectedDate, fetchUsers) => {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Helper function to escape CSV values
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Helper function to format education array
  const formatEducation = (education) => {
    if (!education || !Array.isArray(education) || education.length === 0) return "";
    return education.map(edu => 
      `${edu.degree || ""}|${edu.university || ""}|${edu.year || ""}`
    ).join(";");
  };

  // Helper function to format experience array
  const formatExperience = (experience) => {
    if (!experience || !Array.isArray(experience) || experience.length === 0) return "";
    return experience.map(exp => 
      `${exp.company || ""}|${exp.role || ""}|${exp.years || ""}`
    ).join(";");
  };

  // Helper function to format skills array
  const formatSkills = (skills) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) return "";
    return skills.join(",");
  };

  // Helper function to format company experience array
  const formatCompanyExperience = (companyExp) => {
    if (!companyExp || !Array.isArray(companyExp) || companyExp.length === 0) return "";
    return companyExp.map(exp => 
      `${exp.company || ""}|${exp.role || ""}|${exp.years || ""}`
    ).join(";");
  };

  // Export CSV
  const handleExportCSV = async () => {
    try {

      // Fetch all users for export (no pagination)
      const params = {
        search: searchQuery || undefined,
        filterBy: filterBy,
        date: selectedDate ? selectedDate.toISOString() : undefined,
        page: 1,
        limit: 10000, // Large limit to get all users
      };

      // Use appropriate API based on activeTab
      let api;
      if (activeTab === "Candidates") {
        api = candidateAPI;
      } else if (activeTab === "Employers") {
        api = employerAPI;
      } else if (activeTab === "Admins") {
        api = userAPI;
      } else {
        api = candidateAPI; // Default fallback
      }
      const response = await api.getAll(params);
      
      // Get all users (handle both array and object format)
      let allUsers = [];
      if (Array.isArray(response)) {
        allUsers = response;
      } else {
        allUsers = response.users || [];
      }

      if (allUsers.length === 0) {
        alert("No data available to export");
        return;
      }

      // Define CSV headers based on role
      let headers = [];
      let csvRows = [];

      if (activeTab === "Candidates") {
        headers = [
          "Full Name",
          "Email",
          "Password",
          "Contact",
          "Gender",
          "Date of Birth",
          "Summary",
          "Education",
          "Experience"
        ];

        csvRows = allUsers.map(user => {
          return [
            escapeCSV(user.name || ""),
            escapeCSV(user.email || ""),
            escapeCSV(""), // Password not exported for security
            escapeCSV(user.contact || user.phone || ""),
            escapeCSV(user.gender || ""),
            escapeCSV(user.dob ? new Date(user.dob).toISOString().split('T')[0] : ""),
            escapeCSV(user.summary || ""),
            escapeCSV(formatEducation(user.education)),
            escapeCSV(formatExperience(user.experience))
          ];
        });
      } else if (activeTab === "Employers") {
        // Employers
        headers = [
          "Full Name",
          "Email",
          "Password",
          "Contact",
          "Gender",
          "Date of Birth",
          "Summary",
          "Skills",
          "Company Experience"
        ];

        csvRows = allUsers.map(user => {
          return [
            escapeCSV(user.name || ""),
            escapeCSV(user.email || ""),
            escapeCSV(""), // Password not exported for security
            escapeCSV(user.contact || user.phone || ""),
            escapeCSV(user.gender || ""),
            escapeCSV(user.dob ? new Date(user.dob).toISOString().split('T')[0] : ""),
            escapeCSV(user.summary || ""),
            escapeCSV(formatSkills(user.skills)),
            escapeCSV(formatCompanyExperience(user.companyExperience))
          ];
        });
      } else if (activeTab === "Admins") {
        // Admins - simplified format (no role-specific fields)
        headers = [
          "Full Name",
          "Email",
          "Password",
          "Contact",
          "Role"
        ];

        csvRows = allUsers.map(user => {
          return [
            escapeCSV(user.name || ""),
            escapeCSV(user.email || ""),
            escapeCSV(""), // Password not exported for security
            escapeCSV(user.contact || user.phone || ""),
            escapeCSV(user.role || "")
          ];
        });
      }

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...csvRows.map(row => row.join(","))
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `${activeTab.toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export data. Please try again.");
      throw err;
    }
  };

  // Parse CSV line
  const parseCSVLine = (line) => {
    const result = [];
    let current = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  // Parse education from pipe-separated format
  const parseEducation = (eduString) => {
    if (!eduString || !eduString.trim()) return [];
    
    try {
      return JSON.parse(eduString);
    } catch {
      const entries = eduString.split(";").filter(e => e.trim());
      return entries.map(entry => {
        const parts = entry.split("|").map(p => p.trim());
        return {
          degree: parts[0] || "",
          university: parts[1] || "",
          year: parts[2] || "",
          degreeFile: null,
          status: "Pending"
        };
      });
    }
  };

  // Parse experience from pipe-separated format
  const parseExperience = (expString) => {
    if (!expString || !expString.trim()) return [];
    
    try {
      return JSON.parse(expString);
    } catch {
      const entries = expString.split(";").filter(e => e.trim());
      return entries.map(entry => {
        const parts = entry.split("|").map(p => p.trim());
        return {
          company: parts[0] || "",
          role: parts[1] || "",
          years: parts[2] || ""
        };
      });
    }
  };

  // Upload CSV
  const handleCSVUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setUploadStatus({
        type: "danger",
        message: "No file selected",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // Read CSV file
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      
      if (lines.length < 2) {
        throw new Error("CSV file must have at least a header row and one data row");
      }

      const headers = parseCSVLine(lines[0]).map((h) => 
        h.replace(/^"|"$/g, "").trim().toLowerCase()
      );
      
      // Required columns - check for variations
      const hasFullName = headers.some(h => 
        h === "fullname" || h === "full name" || h === "fullname"
      );
      const hasEmail = headers.includes("email");
      const hasPassword = headers.includes("password");
      
      const missingColumns = [];
      if (!hasFullName) missingColumns.push("Full Name");
      if (!hasEmail) missingColumns.push("Email");
      if (!hasPassword) missingColumns.push("Password");

      if (missingColumns.length > 0) {
        throw new Error(
          `Missing required columns: ${missingColumns.join(", ")}`
        );
      }

      // Parse CSV data
      const users = [];
      let role = "STUDENT";
      if (activeTab === "Employers") {
        role = "EMPLOYER";
      } else if (activeTab === "Admins") {
        role = "ADMIN";
      }

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        
        const values = parseCSVLine(lines[i]).map((v) => 
          v.replace(/^"|"$/g, "").trim()
        );
        const user = {};

        headers.forEach((header, index) => {
          const value = values[index] || "";
          
          // Map CSV columns to user object
          if (header === "fullname" || header === "full name") {
            user.fullName = value;
          } else if (header === "email") {
            user.email = value;
          } else if (header === "password") {
            user.password = value;
          } else if (header === "contact" || header === "phone") {
            user.contact = value;
          } else if (header === "gender") {
            user.gender = value;
          } else if (header === "dob" || header === "date of birth") {
            user.dob = value;
          } else if (header === "summary") {
            user.summary = value;
          } else if (header === "role") {
            user.role = value || role;
          } else if (header === "education" && value) {
            user.education = parseEducation(value);
          } else if (header === "experience" && value) {
            user.experience = parseExperience(value);
          } else if (header === "skills" && value) {
            try {
              user.skills = JSON.parse(value);
            } catch {
              user.skills = value.split(";").filter((s) => s.trim());
            }
          } else if (header === "companyexperience" || header === "company experience") {
            try {
              user.companyExperience = JSON.parse(value);
            } catch {
              user.companyExperience = [];
            }
          }
        });

        // Set default role if not provided
        if (!user.role) {
          user.role = role;
        }

        // Only add user if required fields are present
        if (user.fullName && user.email && user.password) {
          users.push(user);
        }
      }

      if (users.length === 0) {
        throw new Error("No valid users found in CSV file");
      }

      // Call bulk create API
      let api;
      if (activeTab === "Candidates") {
        api = candidateAPI;
      } else if (activeTab === "Employers") {
        api = employerAPI;
      } else if (activeTab === "Admins") {
        // For admin users, use userAPI (but it might not have bulkCreate, so we'll need to handle this)
        // For now, admin users can't be bulk created via CSV - they need to be created individually
        throw new Error("Bulk creation of admin users via CSV is not supported. Please create admin users individually.");
      } else {
        api = candidateAPI;
      }
      const response = await api.bulkCreate(users);

      // Set upload status
      setUploadStatus({
        type: "success",
        message: "Your CSV is uploaded successfully",
        details: response.results,
      });

      // Refresh user list after successful upload
      if (response.results?.success?.length > 0) {
        setTimeout(() => {
          fetchUsers();
        }, 1000);
      }

      return response;
    } catch (err) {
      console.error("CSV upload error:", err);
      setUploadStatus({
        type: "danger",
        message: err.message || "Failed to upload CSV file. Please check the file format.",
      });
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadStatus,
    isUploading,
    setUploadStatus,
    handleCSVUpload,
    handleExportCSV
  };
};

export default useCSVOperations;

