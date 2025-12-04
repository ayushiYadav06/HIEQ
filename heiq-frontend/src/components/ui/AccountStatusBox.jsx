import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const AccountStatusBox = ({ status, onDeactivate, onDelete }) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm mb-4 border">
      <Row className="align-items-center">
        <Col>
          <h5 className="fw-bold">Account Status : {status}</h5>
        </Col>
        <Col className="text-end">
          <Button variant="secondary" className="me-2" onClick={onDeactivate}>
            Deactivate user
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete user
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AccountStatusBox;
