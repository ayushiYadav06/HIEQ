import React from "react";
import DocumentItem from "./DocumentItem";
import { Button } from "react-bootstrap";

const PlusIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const DocumentSection = ({
  title,
  items = [],
  onUploadNew,
}) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm border mb-4">

      {/* SECTION TITLE */}
      <h6 className="fw-bold mb-3">{title}</h6>

      {/* DOCUMENT ITEMS */}
      {items.map((item, index) => (
        <DocumentItem
          key={index}
          documentName={item.documentName}
          uploadedDate={item.uploadedDate}
          status={item.status}
          onStatusChange={item.onStatusChange}
          onView={item.onView}
          onDownload={item.onDownload}
          onUpdate={item.onUpdate}
        />
      ))}

      {/* UPLOAD NEW ROW */}
      <div
        className="mt-3 d-flex align-items-center gap-2 text-primary"
        style={{ cursor: "pointer" }}
        onClick={onUploadNew}
      >
        <PlusIcon /> Upload document
      </div>

    </div>
  );
};

export default DocumentSection;
