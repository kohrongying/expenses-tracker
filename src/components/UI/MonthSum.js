import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card } from "antd";
import { getMonthYear, formatNumber } from "../../helpers/common";

const MonthSum = ({ loading, totalAmount }) => (
  <Card loading={loading}>
    <Row type="flex" justify="space-around" align="middle">
      <Col xs={12}>
        {getMonthYear()}
      </Col>
      <Col xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
        <h3 style={{ marginBottom: 0 }}>
          $ {formatNumber(totalAmount)}
        </h3>
      </Col>
    </Row>
  </Card>
);

MonthSum.propTypes = {
  loading: PropTypes.bool.isRequired,
  totalAmount: PropTypes.number.isRequired,
};

export default MonthSum;