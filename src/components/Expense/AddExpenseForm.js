import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { Form, InputNumber, Input, Button, Radio, Row, Col, message } from "antd";
import { ArrowLeftOutlined, InfoCircleOutlined, RestTwoTone, CarTwoTone, PlayCircleTwoTone, ShoppingTwoTone } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Container from "../UI/Container";
import Header from "../UI/Header";
import Colors from "../../constants/Colors";

const year = new Date().getFullYear();
const month = new Date().getMonth();

const categories = [
  {
    value: "Food",
    label: "Food",
    icon: <RestTwoTone twoToneColor={Colors.pink} style={{ fontSize: 18 }} />,
  },
  {
    value: "Transport",
    label: "Transport",
    icon: <CarTwoTone twoToneColor={Colors.green} style={{ fontSize: 18 }} />,
  },
  {
    value: "Movie",
    label: "Movie",
    icon: <PlayCircleTwoTone twoToneColor={Colors.blue} style={{ fontSize: 18 }}/>,
  },
  {
    value: "Other",
    label: "Other",
    icon: <ShoppingTwoTone twoToneColor={Colors.yellow} style={{ fontSize: 18 }}/>,
  }
];

class AddExpenseForm extends Component {
  formRef = React.createRef();

  static propTypes = {
    uid: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  handleSubmit = (values) => {
    values.date = Date.now()

    firebase.database()
      .ref(`users/${this.props.uid}/${year}/${month}/items`)
      .push(values)
      .then(() => {
        message.success(`Added $${values.amount} successfully`);
        this.formRef.current.resetFields();
      })
      .catch(err => {
        console.error(err);
        message.error("Something went wrong. Please try again.");
      });
  }

  navigateHome = () => {
    this.props.history.push("/");
  }

  render() {
    return (
      <Container>
        <ArrowLeftOutlined
          onClick={this.navigateHome}
          style={{ marginTop: 30 }}
        />

        <Header title="Add Expense" />

        <Form 
          wrapperCol={{span: 24}}
          onFinish={this.handleSubmit}
          initialValues={{ remarks: "", category: ""}}
          ref={this.formRef}
        >
          <Form.Item
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input the amount spent"
              }
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
            />
          </Form.Item>

          <Form.Item name="remarks">
            <Input
              prefix={<InfoCircleOutlined />}
              placeholder="Remarks"
            />
          </Form.Item>

          <Form.Item name="category">
            <Radio.Group style={{ width: "100%" }}>
                {categories.map(option => (
                  <Radio.Button
                    key={option.value}
                    value={option.value}
                    style={{ width: "25%", textAlign: "center" }}
                  >
                    {option.icon}
                  </Radio.Button>
                ))}
              </Radio.Group>
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
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps, {})(withRouter(AddExpenseForm));