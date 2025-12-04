import React, { useRef } from "react";
import "./UploadBox.css";

// IMPORT IMAGE CORRECTLY
import UploadIcon from "../../assets/Rectangle 176.png";

const UploadBox = ({
  title = "Upload document",
  subtitle = "Click on the icon below to upload your file (.pdf format only)",
  file,
  setFile,
  onCancel,
  onUpload,
}) => {
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current.click();

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Only PDF allowed");
      return;
    }

    setFile(selected);
  };

  return (
    <div className="upload-wrapper">
      <h4 className="upload-title">{title}</h4>
      <p className="upload-subtitle">{subtitle}</p>

      {/* IMAGE ICON BOX */}
      <div className="upload-icon-box" onClick={handleClick}>
        <img src={UploadIcon} alt="upload icon" className="upload-icon" />
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        hidden
        ref={inputRef}
        accept=".pdf"
        onChange={handleChange}
      />

      {/* FILE NAME FIELD */}
      <input
        className="upload-filename"
        value={file ? file.name : ""}
        placeholder="No file selected"
        readOnly
      />

      {/* BUTTONS */}
      <div className="upload-btn-row">
        <button className="cancel-btn" onClick={onCancel}>
          CANCEL
        </button>
        <button className="upload-btn" onClick={onUpload} disabled={!file}>
          UPLOAD
        </button>
      </div>
    </div>
  );
};

export default UploadBox;
