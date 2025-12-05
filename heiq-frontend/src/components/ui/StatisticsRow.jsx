// src/components/ui/StatisticsRow.jsx
import React from "react";
import { Row, Col } from "react-bootstrap";

const StatBox = ({ title, value, color }) => (
  <div
    className="p-3 rounded shadow-sm text-center"
    style={{ border: "1px solid #eee", background: "#fff" }}
  >
    <h6 className="text-muted m-0">{title}</h6>
    <h4 className="fw-bold mt-1" style={{ color }}>{value}</h4>
  </div>
);

const StatisticsRow = ({ stats }) => {
  return (
    <Row className="g-3 mb-4">
      {stats.map((s, i) => (
        <Col key={i} xs={6} md={3} lg={2}>
          <StatBox title={s.title} value={s.value} color={s.color} />
        </Col>
      ))}
    </Row>
  );
};

export default StatisticsRow;
