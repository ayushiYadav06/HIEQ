import React from "react";
import { Button, Form } from "react-bootstrap";

import EyeIcon from "../../assets/Eye.png";
import CloudIcon from "../../assets/Cloud.png";

// NEW ICONS
import AadhaarIcon from "../../assets/Group.png"; 
import UploadIcon from "../../assets/Group 411.png";

const DocumentSectionBox = ({ title, items = [], onUploadNew }) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm border mb-4 w-100">
      <h6 className="fw-bold mb-3">{title}</h6>

      {items.map((item, index) => (
        <div
          key={index}
          className="p-3 bg-light rounded border mb-3 w-100"
          style={{ borderColor: "#E6E6E6" }}
        >
          {/* ONE-LINE FLEX */}
          <div className="d-flex align-items-center justify-content-between w-100">
            
            {/* LEFT SIDE */}
            <div className="d-flex align-items-center">

              {/* ICON BEFORE DOCUMENT NAME */}
              {["Aadhar", "BTech", "Software Intern"].includes(item.documentName) && (
                <img
                  src={AadhaarIcon}
                  alt="doc-icon"
                  style={{ width: 18, height: 18, marginRight: 8 }}
                />
              )}

              {/* Document Name */}
              <span className="fw-bold">{item.documentName}</span>

              {/* Uploaded Date */}
              <span style={{ marginLeft: "100px" }}>
                <small className="text-muted">
                  Uploaded on : {item.uploadedDate}
                </small>
              </span>

              {/* Eye Icon */}
              <img
                src={EyeIcon}
                alt="view"
                style={{
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                  marginLeft: "250px",
                  marginRight: "10px",
                }}
                onClick={item.onView}
              />

              {/* Cloud Icon */}
              <img
                src={CloudIcon}
                alt="download"
                style={{
                  width: 22,
                  height: 22,
                  cursor: "pointer",
                  marginLeft: "150px",
                }}
                onClick={item.onDownload}
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="d-flex align-items-center">

              {/* STATUS DROPDOWN */}
              <Form.Select
                value={item.status}
                onChange={item.onStatusChange}
                className="doc-status-dropdown"
                style={{
                  width: "180px",
                  marginRight: "200px",
                  marginLeft: "20px",
                }}
              >
                <option value="Approve" className="approve-option">Approve</option>
                <option value="Reject">Reject</option>
                <option value="Pending">Pending</option>
              </Form.Select>

              <Button
                variant="secondary"
                style={{ minWidth: "140px", marginRight: "20px" }}
                onClick={item.onUpdate}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Upload new (icon replaced) */}
      <div
        className="mt-3 fw-semibold d-flex align-items-center"
        style={{ cursor: "pointer", color: "#585858" }}
        onClick={onUploadNew}
      >
        <img
          src={UploadIcon}
          alt="upload"
          style={{ width: 22, height: 22, marginRight: 6 }}
        />
        Upload document
      </div>
    </div>
  );
};

export default DocumentSectionBox;
