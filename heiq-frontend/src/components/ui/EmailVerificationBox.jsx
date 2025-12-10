import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const EmailVerificationBox = ({ onVerifyEmail, isVerified = false, isProcessing = false }) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm mb-4 border">

      <h6 className="fw-bold mb-1">Email Verification</h6>
      <p className="text-muted small">
        {isVerified
          ? "Email is verified."
          : "Send verification link to the user's registered email ID."}
      </p>
      {isVerified && (
        <p className="text-success small mb-2">✓ Email Verified</p>
      )}

      <Row>
        <Col className="text-end">
          <Button
            variant="secondary"
            onClick={onVerifyEmail}
            disabled={isProcessing || isVerified}
          >
            {isProcessing
              ? "Sending..."
              : isVerified
              ? "Email Verified"
              : "Send verification link"}
          </Button>
        </Col>
      </Row>

    </div>
  );
};

export default EmailVerificationBox;
