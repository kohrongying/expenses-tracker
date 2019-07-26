import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import firebase from "firebase/app";
import "firebase/database";
import { InputNumber, Input, Button, Card, Row, Col } from "antd";

const year = new Date().getFullYear();
const month = new Date().getMonth();

class AddIncomeForm extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
  }

  state = {
    amount: "",
    incomeSource: "",
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
      date: Date.now(),
      incomeSource: this.state.incomeSource,
    };
    firebase.database()
      .ref(`users/${this.props.uid}/${year}/${month}/income`)
      .push(item)
      .then(() => {
        this.setState({
          amount: "",
          incomeSource: "",
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <Card style={{ marginTop: 20, marginBottom: 20, }}>
        <Row>
          <Col xs={20}>
            <p>Add Income</p>
          </Col>
          <Col xs={4} style={{ display: "flex", justifyContent: "flex-end", }}>
            <Button type="primary" onClick={this.handleSubmit}>
              Save
            </Button>
          </Col>
        </Row>

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
              placeholder="Income Source"
              value={this.state.incomeSource}
              onChange={this.handleChange("incomeSource")}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps, {})(AddIncomeForm);