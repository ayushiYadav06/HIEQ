import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";

import EyeIcon from "../../assets/Eye.png";
import CloudIcon from "../../assets/Cloud.png";
import AadhaarIcon from "../../assets/Group.png";
import UploadIcon from "../../assets/Group 411.png";

const DocumentSectionBox = ({ title, items = [], onUploadNew }) => {
  return (
    <div className="p-3 p-md-4 bg-white rounded shadow-sm border mb-4">
      {/* SECTION TITLE */}
      <h6 className="fw-bold mb-3">{title}</h6>

      {items.map((item, index) => (
        <div key={index} className="p-3 bg-light rounded border mb-3">
          <Row className="align-items-center gy-3">

            {/* LEFT: ICON + NAME + DATE + EYE/CLOUD BUTTONS */}
            <Col xs={12} lg={6}>
              <div className="d-flex flex-wrap align-items-center gap-3">

                {/* DOC ICON + NAME */}
                <div className="d-flex align-items-center gap-2">
                  <img src={AadhaarIcon} width={18} height={18} alt="doc" />
                  <span className="fw-semibold">{item.documentName}</span>
                </div>

                {/* DATE */}
                <small className="text-muted">
                  Uploaded on: {item.uploadedDate}
                </small>

                {/* EYE + CLOUD AS BOOTSTRAP BUTTONS */}
                <div className="btn-group" role="group">
                  <Button
                    variant="light"
                    size="sm"
                    className="d-flex align-items-center justify-content-center"
                    onClick={item.onView}
                  >
                    <img src={EyeIcon} width={18} height={18} alt="view" />
                  </Button>

                  <Button
                    variant="light"
                    size="sm"
                    className="d-flex align-items-center justify-content-center"
                    onClick={item.onDownload}
                  >
                    <img src={CloudIcon} width={20} height={20} alt="download" />
                  </Button>
                </div>
              </div>
            </Col>

            {/* RIGHT: APPROVE DROPDOWN + UPDATE BUTTON */}
            <Col xs={12} lg={6}>
              <Row className="gy-2">
                <Col xs={12} sm={6}>
                  <Form.Select
                    value={item.status}
                    onChange={item.onStatusChange}
                    className="w-100"
                  >
                    <option value="Approve">Approve</option>
                    <option value="Reject">Reject</option>
                    <option value="Pending">Pending</option>
                  </Form.Select>
                </Col>

                <Col xs={12} sm={6}>
                  <Button
                    variant="secondary"
                    className="w-100 fw-semibold"
                    onClick={item.onUpdate}
                  >
                    Update
                  </Button>
                </Col>
              </Row>
            </Col>

          </Row>
        </div>
      ))}

      {/* UPLOAD DOCUMENT — BOOTSTRAP LINK BUTTON */}
      <Button
        variant="link"
        className="mt-2 p-0 d-inline-flex align-items-center gap-2 text-secondary fw-semibold"
        onClick={onUploadNew}
      >
        <img src={UploadIcon} width={22} height={22} alt="upload" />
        Upload document
      </Button>
    </div>
  );
};

export default DocumentSectionBox;
