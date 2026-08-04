import React from "react";
import PropTypes from "prop-types";
import { Typography } from "antd";

const { Title } = Typography;

const Header = ({ title }) => (
  <Title level={2} style={{ marginTop: 30 }}>{title}</Title>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;