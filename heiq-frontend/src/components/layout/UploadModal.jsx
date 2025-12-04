import React from "react";
import UploadBox from "./UploadBox.jsx";
import "./UploadModal.css";

const UploadModal = ({ open, onClose, file, setFile, onUpload }) => {
  if (!open) return null;

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal-container" onClick={(e) => e.stopPropagation()}>
        <UploadBox
          file={file}
          setFile={setFile}
          onCancel={onClose}
          onUpload={onUpload}
        />
      </div>
    </div>
  );
};

export default UploadModal;
