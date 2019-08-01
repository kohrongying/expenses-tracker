import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";

const Container = (props) => (
  <Row>
    <Col
      xs={{ span: 20, offset: 2 }}
      lg={{ span: 16, offset: 4 }}
      style={{ paddingTop: 20, paddingBottom: 20 }}
    >
      {props.children}
    </Col>
  </Row>
);

Container.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Container;