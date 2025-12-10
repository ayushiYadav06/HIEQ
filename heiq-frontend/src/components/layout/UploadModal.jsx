import React from "react";
import UploadBox from "./UploadBox.jsx";
import "./UploadModal.css";

const UploadModal = ({ open, onClose, file, setFile, files, setFiles, onUpload, isProcessing = false, allowMultiple = false }) => {
  if (!open) return null;

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal-container" onClick={(e) => e.stopPropagation()}>
        <UploadBox
          file={file}
          setFile={setFile}
          files={files}
          setFiles={setFiles}
          onCancel={onClose}
          onUpload={onUpload}
          isProcessing={isProcessing}
          allowMultiple={allowMultiple}
        />
      </div>
    </div>
  );
};

export default UploadModal;
