import React from "react";
import PropTypes from "prop-types";
import { InputNumber, Input, Button, Card, Row, Col } from "antd";

const GeneralForm = ({
  title,
  handleSubmit,
  amount,
  handleAmountchange,
  text,
  placeholderText,
  handleTextChange,
}) => (
  <Card style={{ marginTop: 20, marginBottom: 20, }}>
    <Row>
      <Col xs={20}>
        <p>{title}</p>
      </Col>
      <Col xs={4} style={{ display: "flex", justifyContent: "flex-end", }}>
        <Button type="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Col>
    </Row>

    <Row gutter={8}>
      <Col xs={12}>
        <InputNumber
          value={amount}
          style={{ width: "100%" }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
          onChange={handleAmountchange}
        />
      </Col>

      <Col xs={12}>
        <Input
          placeholder={placeholderText}
          value={text}
          onChange={handleTextChange}
        />
      </Col>
    </Row>
  </Card>
);

GeneralForm.propTypes = {
  title: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  handleAmountchange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  placeholderText: PropTypes.string.isRequired,
  handleTextChange: PropTypes.func.isRequired,
};

export default GeneralForm;