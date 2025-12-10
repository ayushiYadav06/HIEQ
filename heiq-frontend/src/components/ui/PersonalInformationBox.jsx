import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import CameraIcon from "../../assets/Group_163.png";

const PersonalInformationBox = ({ profileImage, onUpload, values = {}, onChange }) => {
  return (
    <div className="bg-white rounded border p-4 mt-4" style={{ maxWidth: "1500px", margin: "0 auto" }}>
      <h4 className="fw-semibold mb-4">1. Personal Information</h4>

      <Row className="g-4 align-items-start">

        {/* LEFT FORM — WIDER NOW */}
        <Col xs={12} md={7} lg={8}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter full name"
              value={values.name}
              onChange={onChange}
            />
          </Form.Group>

          <Row>
            <Col xs={12} md={6} className="mb-3">
              <Form.Label>Email Address *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={values.email}
                onChange={onChange}
              />
            </Col>

            <Col xs={12} md={6} className="mb-3">
              <Form.Label>Contact Number *</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="Enter phone"
                value={values.phone}
                onChange={onChange}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6} className="mb-3">
              <Form.Label>Gender *</Form.Label>
              <Form.Select name="gender" value={values.gender} onChange={onChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={6} className="mb-3">
              <Form.Label>Date of Birth *</Form.Label>
              <Form.Control type="date" name="dob" value={values.dob} onChange={onChange} />
            </Col>
          </Row>
        </Col>

        {/* RIGHT AVATAR — PROPER SIZE */}
        <Col xs={12} md={5} lg={4} className="text-center d-flex flex-column align-items-center">
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #ccc",
              position: "relative",
            }}
          >
            <img
              src={profileImage}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            <button
              onClick={onUpload}
              style={{
                position: "absolute",
                bottom: -20,
                left: "50%",
                transform: "translateX(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <img src={CameraIcon} alt="Upload" style={{ width: 60 }} />
            </button>
          </div>
        </Col>
      </Row>

      {/* SUMMARY — ALWAYS FULL WIDTH */}
      <Row className="mt-4">
        <Col xs={12}>
          <Form.Label>Profile Summary *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="summary"
            placeholder="Enter summary"
            value={values.summary}
            onChange={onChange}
          />
          <p className="text-end text-muted mt-1">250 words limit</p>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalInformationBox;
