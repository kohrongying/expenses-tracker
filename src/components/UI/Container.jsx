import React from "react";
import { Row, Col } from "antd";

const Container = (props) => (
  <Row>
    <Col
      xs={{ span: 20, offset: 2 }}
      lg={{ span: 16, offset: 4 }}
      style={{ paddingTop: 40, paddingBottom: 20 }}
    >
      {props.children}
    </Col>
  </Row>
);

export default Container;