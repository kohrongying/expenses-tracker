import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import { withRouter } from "react-router-dom";
import withAuth from "./store/withAuth";
import Dashboard from "./components/Dashboard/Dashboard";
import Container from "./components/UI/Container";
import Header from "./components/UI/Header";
import { Button, Spin } from "antd";

const provider = new firebase.auth.GoogleAuthProvider();

class Home extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    authLogin: PropTypes.func.isRequired,
  }

  state = {
    loading: false
  }

  login = () => {
    this.setState({ loading: true });
    firebase.auth().signInWithPopup(provider)
      .then((result)=>{
        this.props.authLogin(result.user);
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <React.Fragment>
        <div className="App">

          {this.props.isAuthenticated ? (
            <Dashboard />
          ) : (
            <Container>
              {this.state.loading ? (<Spin size="large" />) : (
                <>
                  <Header title="Expense Tracker" />
                  <p>Track your monthly expenditure, set your income and a budget for yourself. Do not be stupid.</p>
                  <Button type="primary" onClick={this.login}>Login with Google</Button>
                </>
              )}

            </Container>
          )}

        </div>
      </React.Fragment>
    );
  }
}

export default withAuth(withRouter(Home));