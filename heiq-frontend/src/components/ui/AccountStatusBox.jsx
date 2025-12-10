import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const AccountStatusBox = ({ status, email, onDeactivate, onDelete, isProcessing = false }) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm mb-4 border">
      <Row className="align-items-center">
        
        {/* LEFT SIDE TEXT */}
        <Col xs={12} md={6}>
          <div>
            <h5 className="fw-bold mb-2">Account Status: {status}</h5>
            {email && (
              <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
                Email: {email}
              </p>
            )}
          </div>
        </Col>

        {/* RIGHT SIDE BUTTONS – ALWAYS IN ONE LINE */}
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-md-end justify-content-start gap-3 flex-nowrap mt-3 mt-md-0"
        >
          <Button 
            variant="secondary" 
            onClick={onDeactivate}
            disabled={isProcessing}
          >
            {status === "Inactive" ? "Activate user" : "Deactivate user"}
          </Button>

          <Button 
            variant="danger" 
            onClick={onDelete}
            disabled={isProcessing}
          >
            Delete user
          </Button>
        </Col>

      </Row>
    </div>
  );
};

export default AccountStatusBox;
