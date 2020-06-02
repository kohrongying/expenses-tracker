import React from "react";
import PropTypes from "prop-types";
import { InputNumber, Input, Button, Form } from "antd";
import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons"
import Container from "./Container";
import Header from "./Header";

const GeneralForm = ({
  navigateHome,
  title,
  handleSubmit,
  amount,
  handleAmountchange,
  text,
  placeholderText,
  handleTextChange,
}) => (
  <Container>

    <ArrowLeftOutlined
                onClick={navigateHome}
                style={{ marginTop: 30 }}
              />
    <Header title={title} />

    <Form onSubmit={handleSubmit}>
      <Form.Item>
        <InputNumber
          value={amount}
          style={{ width: "100%" }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
          onChange={handleAmountchange}
        />
      </Form.Item>

      <Form.Item>
        <Input
          prefix={<InfoCircleOutlined />}
          placeholder={placeholderText}
          value={text}
          onChange={handleTextChange}
        />
      </Form.Item>

      <Form.Item>
        <Button
          disabled={amount === ""}
          type="primary"
          htmlType="submit"
          block
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  </Container>
);

GeneralForm.propTypes = {
  navigateHome: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleAmountchange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  placeholderText: PropTypes.string.isRequired,
  handleTextChange: PropTypes.func.isRequired,
};

export default GeneralForm;