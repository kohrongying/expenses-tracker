import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "./actions";
import firebase from "firebase/app";
import "firebase/auth";
import Dashboard from "./components/Dashboard/Dashboard";
import Container from "./components/UI/Container";
import Header from "./components/UI/Header";
import { Button } from "antd";

const provider = new firebase.auth.GoogleAuthProvider();

class Home extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
  }

  login = () => {
    firebase.auth().signInWithRedirect(provider)
      .then((result)=>{
        this.props.login(result.user.uid);
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <React.Fragment>
        <div className="App">

          {this.props.isAuthenticated ? (
            <Dashboard />
          ) : (
            <Container>
              <Header title="Expense Tracker" />
              <p>Track your monthly expenditure, set your income and a budget for yourself. Do not be stupid.</p>
              <Button onClick={this.login}>Login</Button>
            </Container>
          )}

        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({ isAuthenticated: state.user.isAuthenticated, });

export default connect(mapStateToProps, { login })(Home);