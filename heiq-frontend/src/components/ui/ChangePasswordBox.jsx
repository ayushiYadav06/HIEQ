import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

const ChangePasswordBox = ({ onChangePassword, isProcessing = false }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    onChangePassword(newPassword, confirmPassword);
    setNewPassword("");
    setConfirmPassword("");
  };
  return (
    <div className="p-4 bg-white rounded shadow-sm mb-4 border">

      <h6 className="fw-bold mb-3">Change Password</h6>

      <Form onSubmit={handleSubmit}>
        <Row className="gy-3">
          <Col md={4}>
            <Form.Control
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </Col>

          <Col md={4}>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </Col>

          <Col md={4}>
            <Button
              type="submit"
              variant="secondary"
              className="w-100"
              disabled={isProcessing}
            >
              {isProcessing ? "Changing..." : "Change password"}
            </Button>
          </Col>
        </Row>
      </Form>

    </div>
  );
};

export default ChangePasswordBox;
