import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

const ChangePasswordBox = ({ onChangePassword }) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm mb-4 border">

      <h6 className="fw-bold mb-3">Change Password</h6>

      <Row className="gy-3">
        <Col md={4}>
          <Form.Control placeholder="New password" />
        </Col>

        <Col md={4}>
          <Form.Control placeholder="Confirm new password" />
        </Col>

        <Col md={4}>
          <Button variant="secondary" className="w-100" onClick={onChangePassword}>
            Change password
          </Button>
        </Col>
      </Row>

    </div>
  );
};

export default ChangePasswordBox;
