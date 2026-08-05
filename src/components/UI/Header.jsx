import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const Header = ({ title }) => (
  <Title level={2} style={{ marginTop: 30 }}>{title}</Title>
);

export default Header;