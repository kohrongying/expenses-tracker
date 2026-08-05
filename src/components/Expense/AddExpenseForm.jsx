import React, { useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/database";
import { Form, InputNumber, Input, Button, Radio, message } from "antd";
import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Container from "../UI/Container";
import Header from "../UI/Header";
import { categories } from "../../constants/ExpenseCategories";

const year = new Date().getFullYear();
const month = new Date().getMonth();

function AddExpenseForm() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const history = useHistory();
  const formRef = useRef();

  const handleSubmit = (values) => {
    values.date = Date.now();

    firebase.database()
      .ref(`users/${uid}/${year}/${month}/items`)
      .push(values)
      .then(() => {
        message.success(`Added $${values.amount} successfully`);
        if (formRef.current) {
          formRef.current.resetFields();
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Something went wrong. Please try again.");
      });
  };

  const navigateHome = () => {
    history.push("/");
  };

  return (
    <Container>
      <ArrowLeftOutlined onClick={navigateHome} style={{ marginTop: 30 }} />

      <Header title="Add Expense" />

      <Form wrapperCol={{ span: 24 }} onFinish={handleSubmit} initialValues={{ remarks: "", category: "" }} ref={formRef}>
        <Form.Item
          name="amount"
          rules={[{ required: true, message: "Please input the amount spent" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            min={0}
          />
        </Form.Item>

        <Form.Item name="remarks">
          <Input prefix={<InfoCircleOutlined />} placeholder="Remarks" />
        </Form.Item>

        <Form.Item name="category">
          <Radio.Group style={{ width: "100%" }}>
            {categories.map((option) => (
              <Radio.Button key={option.value} value={option.value} style={{ width: "20%", textAlign: "center" }}>
                {option.icon}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}

export default AddExpenseForm;