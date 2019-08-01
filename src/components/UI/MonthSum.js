import React from "react";
import PropTypes from "prop-types";
import { Card, Typography } from "antd";
import { getMonthYear, formatNumber } from "../../helpers/common";
const { Title } = Typography;

const MonthSum = ({ loading, totalAmount, title }) => (
  <Card
    loading={loading}
    bordered={false}
    bodyStyle={{
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    }}
  >
    <p>{title} - {getMonthYear()}</p>
    <Title style={{ fontSize: 50, margin: 0, }}>$ {formatNumber(totalAmount)}</Title>
  </Card>

);

MonthSum.propTypes = {
  loading: PropTypes.bool.isRequired,
  totalAmount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default MonthSum;