import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { Form, InputNumber, Icon, Input, Button, Radio, Row, Col, message } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Container from "../UI/Container";
import Header from "../UI/Header";

const year = new Date().getFullYear();
const month = new Date().getMonth();

const categories = [
  {
    value: "Food",
    label: "Food",
    icon: "rest",
    color: "#ff85c0"
  },
  {
    value: "Transport",
    label: "Transport",
    icon: "car",
    color: "#5cdbd3"
  },
  {
    value: "Movie",
    label: "Movie",
    icon: "play-square",
    color: "#597ef7"
  },
  {
    value: "Other",
    label: "Other",
    icon: "shopping",
    color: "#ffd666"
  }
];

class AddExpenseForm extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    amount: "",
    category: "Food",
    remarks: "",
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSelect = name => value => {
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const item = {
      amount: parseFloat(this.state.amount),
      category: this.state.category,
      date: Date.now(),
      remarks: this.state.remarks,
    };
    firebase.database()
      .ref(`users/${this.props.uid}/${year}/${month}/items`)
      .push(item)
      .then(() => {
        message.success(`Added $${this.state.amount} successfully`);
        this.setState({
          amount: "",
          remarks: "",
        });
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
        <Icon
          type="arrow-left"
          onClick={this.navigateHome}
          style={{ marginTop: 30, }}
        />
        <Header title="Add Expense" />

        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            <InputNumber
              value={this.state.amount}
              style={{ width: "100%" }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
              onChange={this.handleSelect("amount")}
            />
          </Form.Item>

          <Form.Item>
            <Input
              prefix={<Icon type="info-circle" />}
              placeholder="Remarks"
              value={this.state.remarks}
              onChange={this.handleChange("remarks")}
            />
          </Form.Item>

          <Row>
            <Col xs={24}>
              <Radio.Group
                size="large"
                style={{ width: "100%", marginTop: 10, }}
                value={this.state.category}
                onChange={this.handleChange("category")}
              >
                {categories.map(option => (
                  <Radio.Button
                    key={option.value}
                    value={option.value}
                    style={{ width: "25%", textAlign: "center", }}
                  >
                    <Icon
                      style={{ fontSize: 18 }}
                      type={option.icon}
                      theme="twoTone"
                      twoToneColor={option.color}
                    />
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Col>
          </Row>

          <Form.Item>
            <Button
              disabled={this.state.amount === ""}
              style={{ marginTop: 30, }}type="primary"
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