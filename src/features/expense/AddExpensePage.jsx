import React, { useRef } from "react";
import { Form, InputNumber, Input, Button, Radio, message } from "antd";
import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Container from "../../components/ui/Container";
import Header from "../../components/ui/Header";
import { categories } from "../../constants/ExpenseCategories";
import { addExpense } from "./expenseApi";

function AddExpensePage() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const history = useHistory();
  const formRef = useRef();

  const handleSubmit = async (values) => {
    try {
      await addExpense(uid, values);
      message.success(`Added $${values.amount} successfully`);
      if (formRef.current) {
        formRef.current.resetFields();
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong. Please try again.");
    }
  };

  const navigateHome = () => {
    history.push("/");
  };

  return (
    <Container>
      <ArrowLeftOutlined onClick={navigateHome} style={{ marginTop: 30 }} />
      <Header title="Add Expense" />

      <Form
        wrapperCol={{ span: 24 }}
        onFinish={handleSubmit}
        initialValues={{ remarks: "", category: "" }}
        ref={formRef}
      >
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
              <Radio.Button
                key={option.value}
                value={option.value}
                style={{ width: "20%", textAlign: "center" }}
              >
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

export default AddExpensePage;