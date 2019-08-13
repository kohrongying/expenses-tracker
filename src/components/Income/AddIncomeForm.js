import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import GeneralForm from "../UI/GeneralForm";
import { withRouter } from "react-router-dom";
import { message } from "antd";

const year = new Date().getFullYear();
const month = new Date().getMonth();

class AddIncomeForm extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    amount: "",
    incomeSource: ""
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
      amount: this.state.amount,
      date: Date.now(),
      source: this.state.incomeSource,
    };
    firebase.database()
      .ref(`users/${this.props.uid}/${year}/${month}/income`)
      .push(item)
      .then(() => {
        message.success(`Added $${this.state.amount} to income successfully`);
        this.setState({
          amount: "",
          incomeSource: "",
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
      <GeneralForm
        navigateHome={this.navigateHome}
        title="Add Income"
        handleSubmit={this.handleSubmit}
        amount={this.state.amount}
        handleAmountchange={this.handleSelect("amount")}
        text={this.state.incomeSource}
        placeholderText="Income Source"
        handleTextChange={this.handleChange("incomeSource")}
      />

    );
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps, {})(withRouter(AddIncomeForm));