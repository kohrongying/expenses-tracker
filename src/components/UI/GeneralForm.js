import React from "react";
import PropTypes from "prop-types";
import { InputNumber, Input, Button, Form } from "antd";
import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Container from "./Container";
import Header from "./Header";

const GeneralForm = ({
  navigateHome,
  title,
  handleSubmit,
  placeholderText,
  formRef,
}) => (
  <Container>

    <ArrowLeftOutlined
      onClick={navigateHome}
      style={{ marginTop: 30 }}
    />
    <Header title={title} />

    <Form
      wrapperCol={{ span: 24 }}
      onFinish={handleSubmit}
      ref={formRef}
    >
      <Form.Item
        name="amount"
        rules={[
          {
            required: true,
            message: "Please input the amount"
          }
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>

      <Form.Item
        name="source"
        rules={[
          {
            required: true,
            message: "Please input the source"
          }
        ]}
      >
        <Input
          prefix={<InfoCircleOutlined />}
          placeholder={placeholderText}
        />
      </Form.Item>

      <Form.Item>
        <Button
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
  placeholderText: PropTypes.string.isRequired,
  formRef: PropTypes.any.isRequired,
};

export default GeneralForm;