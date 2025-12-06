// UploadBox.jsx
import React from "react";
import { Button } from "react-bootstrap";
import UploadIcon from "../../assets/Group 411.png";

const UploadBox = ({ file, setFile, onCancel, onUpload }) => {
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded p-4" style={{ width: "400px", maxWidth: "90vw" }}>
      <h5 className="mb-3">Upload Document</h5>
      
      <div
        className="border rounded p-4 text-center mb-3"
        style={{
          borderStyle: "dashed",
          borderColor: "#ccc",
          background: "#f9f9f9",
          cursor: "pointer"
        }}
        onClick={() => document.getElementById("file-input").click()}
      >
        <img src={UploadIcon} alt="upload" style={{ width: 40, height: 40, marginBottom: 10 }} />
        <p className="mb-1">Click to browse or drag & drop</p>
        <p className="text-muted small">Supported formats: PDF, JPG, PNG</p>
        <input
          id="file-input"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {file && (
        <div className="mb-3 p-2 border rounded d-flex justify-content-between align-items-center">
          <span className="text-truncate">{file.name}</span>
          <Button variant="link" size="sm" onClick={() => setFile(null)}>
            Remove
          </Button>
        </div>
      )}

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={onUpload}
          disabled={!file}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default UploadBox;