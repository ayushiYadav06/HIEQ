import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const EmailVerificationBox = ({ onVerifyEmail }) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm mb-4 border">

      <h6 className="fw-bold mb-1">Email Verification</h6>
      <p className="text-muted small">
        Send verification link to the user’s registered email ID.
      </p>

      <Row>
        <Col className="text-end">
          <Button variant="secondary" onClick={onVerifyEmail}>
            Send verification link
          </Button>
        </Col>
      </Row>

    </div>
  );
};

export default EmailVerificationBox;
