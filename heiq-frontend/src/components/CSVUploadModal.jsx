import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";
import { colors } from "../theme/colors";

const CSVUploadModal = ({ isOpen, onClose, onUpload, isUploading = false, uploadStatus = null }) => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  // Reset file selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setFileError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  const handleFileSelect = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files?.[0];
    setFileError("");
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      setFileError("Please select a CSV file");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size must be less than 5MB");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleFileButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!selectedFile) {
      setFileError("Please select a CSV file first");
      return;
    }

    // Create a file event object to pass to onUpload
    const syntheticEvent = {
      target: {
        files: [selectedFile],
      },
      preventDefault: () => {},
      stopPropagation: () => {},
    };

    onUpload(syntheticEvent);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Modal 
      show={isOpen} 
      onHide={handleClose} 
      centered 
      size="lg"
      onClick={(e) => {
        // Prevent modal from closing when clicking inside modal content
        if (e.target === e.currentTarget) {
          // Only close if clicking the backdrop
          handleClose();
        }
      }}
    >
      <Modal.Header
        closeButton
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        }}
      >
        <Modal.Title style={{ color: themeColors.text }}>
          Upload CSV File
        </Modal.Title>
      </Modal.Header>
      <Modal.Body 
        style={{ backgroundColor: themeColors.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Upload Status Alert */}
        {uploadStatus && (
          <Alert
            variant={uploadStatus.type}
            dismissible
            onClose={() => {}}
            className="mb-4"
          >
            <Alert.Heading>
              {uploadStatus.type === "success"
                ? "Upload Successful!"
                : "Upload Failed"}
            </Alert.Heading>
            <p>{uploadStatus.message}</p>
            {uploadStatus.details &&
              uploadStatus.details.failed &&
              uploadStatus.details.failed.length > 0 && (
                <div className="mt-3">
                  <strong>Failed entries:</strong>
                  <ul className="mb-0">
                    {uploadStatus.details.failed.slice(0, 5).map((fail, idx) => (
                      <li key={idx}>
                        {fail.email}: {fail.reason}
                      </li>
                    ))}
                    {uploadStatus.details.failed.length > 5 && (
                      <li>
                        ... and {uploadStatus.details.failed.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
          </Alert>
        )}

        {/* File Input (Hidden) */}
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileSelect}
          onClick={(e) => e.stopPropagation()}
          style={{ display: "none" }}
        />

        {/* File Selection Area - Hide after successful upload */}
        {!(uploadStatus && uploadStatus.type === "success") && (
          <div
            className="border rounded p-4 text-center"
            style={{
              borderColor: themeColors.border,
              backgroundColor: themeColors.inputBackground,
              borderStyle: "dashed",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={handleFileButtonClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.primaryGreen;
              e.currentTarget.style.backgroundColor = themeColors.hoverBackground;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = themeColors.border;
              e.currentTarget.style.backgroundColor = themeColors.inputBackground;
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                if (file.name.endsWith(".csv") && file.size <= 5 * 1024 * 1024) {
                  setSelectedFile(file);
                  setFileError("");
                } else {
                  setFileError("Please drop a valid CSV file (max 5MB)");
                }
              }
            }}
          >
            {selectedFile ? (
              <div>
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>📄</div>
                <p style={{ color: themeColors.text, margin: 0, fontWeight: 500 }}>
                  {selectedFile.name}
                </p>
                <p
                  style={{
                    color: themeColors.textSecondary,
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                >
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedFile(null);
                    setFileError("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  style={{ color: colors.primaryGreen, textDecoration: "none" }}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>📁</div>
                <p style={{ color: themeColors.text, margin: 0, fontWeight: 500 }}>
                  Click to choose CSV file
                </p>
                <p
                  style={{
                    color: themeColors.textSecondary,
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                >
                  Supported format: CSV (Max 5MB)
                </p>
              </div>
            )}
          </div>
        )}

        {/* File Error */}
        {fileError && (
          <Alert variant="danger" className="mt-3 mb-0">
            {fileError}
          </Alert>
        )}

        {/* Instructions */}
        <div className="mt-4">
          <p style={{ color: themeColors.textSecondary, fontSize: "14px", margin: 0 }}>
            <strong>Instructions:</strong>
          </p>
          <ul style={{ color: themeColors.textSecondary, fontSize: "13px", marginTop: "8px" }}>
            <li>Ensure your CSV file has the required columns: Full Name, Email</li>
            <li>For Candidates: Include Education and Experience columns</li>
            <li>For Employers: Include Skills and Company Experience columns</li>
            <li>Date format should be YYYY-MM-DD (e.g., 1990-01-15)</li>
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        }}
      >
        {uploadStatus && uploadStatus.type === "success" ? (
          <>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              style={{
                backgroundColor: themeColors.buttonSecondaryBackground,
                borderColor: themeColors.border,
                color: themeColors.buttonSecondaryText,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              style={{
                backgroundColor: colors.primaryGreen,
                borderColor: colors.primaryGreen,
                color: "#ffffff",
                minWidth: "120px",
              }}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              disabled={isUploading}
              style={{
                backgroundColor: themeColors.buttonSecondaryBackground,
                borderColor: themeColors.border,
                color: themeColors.buttonSecondaryText,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleUpload(e);
              }}
              disabled={!selectedFile || isUploading}
              style={{
                backgroundColor: colors.primaryGreen,
                borderColor: colors.primaryGreen,
                color: "#ffffff",
                minWidth: "120px",
              }}
            >
              {isUploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CSVUploadModal;

