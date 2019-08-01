import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { InputNumber, Icon, Input, Button, Card, Radio, Row, Col } from "antd";
import { connect } from "react-redux";

const year = new Date().getFullYear();
const month = new Date().getMonth();

const categories = [
  {
    value: "Food",
    label: "Food",
    icon: "coffee",
  },
  {
    value: "Transport",
    label: "Transport",
    icon: "car",
  },
  {
    value: "Movie",
    label: "Movie",
    icon: "play-square",
  },
  {
    value: "Other",
    label: "Other",
    icon: "shopping"
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
                          <Icon style={{ fontSize: 18 }} type={option.icon} />
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  </Col>
                </Row>

              </Col>
            </Row>


          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps, {})(AddExpenseForm);