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
  <Row>
    <Col
      xs={{ span: 23, offset: 1 }}
      lg={{ span: 22, offset: 2 }}
    >

      <Card
        bordered={false}
        bodyStyle={{
          backgroundColor: "#B2EBF2",
          borderTopLeftRadius: 75,
          borderBottomLeftRadius: 75,
        }}
      >
        <Row>
          <Col
            xs={{ span: 22, offset: 1 }}
            lg={{ span: 18, offset: 2 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", }}>
              <p>{title}</p>
              <Button onClick={handleSubmit}>
                Save
              </Button>
            </div>

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

          </Col>
        </Row>
      </Card>
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