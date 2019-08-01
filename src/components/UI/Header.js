import React from "react";
import PropTypes from "prop-types";
import { Typography, Row, Col } from "antd";
const { Title } = Typography;

const Header = ({ title }) => (
  <Row>
    <Col>
      <Title style={{ marginTop: 30 }}>{title}</Title>
    </Col>
  </Row>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;