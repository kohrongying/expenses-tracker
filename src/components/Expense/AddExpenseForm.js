import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { InputNumber, Icon, Input, Button, Radio, Row, Col } from "antd";
import { connect } from "react-redux";

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
        this.setState({
          amount: "",
          remarks: "",
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <Row style={{ position: "absolute", bottom: 0, left: 0, right: 0,height: "30%", backgroundColor: "white", paddingTop: 30, paddingBottom: 35, boxShadow: "rgba(174, 174, 174, 0.5) 1px 0 14px 2px", zIndex: 999, borderRadius: "30px 30px 0 0" }}>
        <Col
          xs={{ span: 20, offset: 2 }}
          lg={{ span: 16, offset: 4 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", }}>
            <p>Add Expense</p>
            <Button onClick={this.handleSubmit}>
              Save
            </Button>
          </div>

          <Row gutter={8}>
            <Col xs={12}>
              <InputNumber
                value={this.state.amount}
                style={{ width: "100%" }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={value => value.replace(/\$\s?|(,*)/g, "")}
                onChange={this.handleSelect("amount")}
              />
            </Col>

            <Col xs={12}>
              <Input
                placeholder="Remarks"
                value={this.state.remarks}
                onChange={this.handleChange("remarks")}
              />
            </Col>
          </Row>

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

        </Col>
      </Row>

    );
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps, {})(AddExpenseForm);