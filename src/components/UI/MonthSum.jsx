import React from "react";
import { Card, Typography } from "antd";
import { getMonthYear, formatNumber, formatCentsToString } from "../../helpers/common";
const { Title } = Typography;

const MonthSum = ({ loading, totalAmountInCents, title }) => (
  <Card
    loading={loading}
    bordered={false}
    bodyStyle={{
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: "rgba(240, 240, 240, 0.7)",
    }}
  >
    <p>
      {title} - {getMonthYear()}
    </p>
    <Title style={{ fontSize: 50, margin: 0 }}>
      S$ {formatCentsToString(totalAmountInCents)}
    </Title>
  </Card>
);

export default MonthSum;
