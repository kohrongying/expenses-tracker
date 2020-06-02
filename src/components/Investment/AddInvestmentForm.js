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

class AddinvestmentForm extends Component {
  formRef = React.createRef();

  static propTypes = {
    uid: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  handleSubmit = (values) => {
    values.date = Date.now();

    firebase.database()
      .ref(`users/${this.props.uid}/${year}/${month}/investments`)
      .push(values)
      .then(() => {
        message.success(`Added $${values.amount} to investment successfully`);
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
      <GeneralForm
        formRef={this.formRef}
        navigateHome={this.navigateHome}
        title="Add Investment"
        handleSubmit={this.handleSubmit}
        placeholderText="Investment Source"
      />

    );
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps, {})(withRouter(AddinvestmentForm));