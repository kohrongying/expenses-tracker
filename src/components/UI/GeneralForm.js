import React from "react";
import PropTypes from "prop-types";
import { InputNumber, Input, Button, Row, Col } from "antd";

const GeneralForm = ({
  title,
  handleSubmit,
  amount,
  handleAmountchange,
  text,
  placeholderText,
  handleTextChange,
}) => (
  <Row style={{ backgroundColor: "white", paddingTop: 30, paddingBottom: 35, height: "24%", position: "absolute", bottom: 0, left: 0, right: 0, boxShadow: "rgba(174, 174, 174, 0.5) 1px 0 14px 2px", zIndex: 999, borderRadius: "30px 30px 0 0" }}>
    <Col
      xs={{ span: 20, offset: 2 }}
      lg={{ span: 16, offset: 4 }}
    >
      <div style={{ display: "flex", marginBottom: 15, justifyContent: "space-between", }}>
        <p>{title}</p>
        <Button onClick={handleSubmit}>
                Save
        </Button>
      </div>

      <Row gutter={16}>
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
    </Col>
  </Row>
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