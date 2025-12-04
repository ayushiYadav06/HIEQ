import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const ResetPasswordBox = ({ onResetPassword }) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm mb-4 border">

      <h6 className="fw-bold mb-1">Reset Password</h6>
      <p className="text-muted small">
        A reset password link will be sent to the user’s registered email.
      </p>

      <Row>
        <Col className="text-end">
          <Button variant="secondary" onClick={onResetPassword}>
            Send reset password link
          </Button>
        </Col>
      </Row>

    </div>
  );
};

export default ResetPasswordBox;
