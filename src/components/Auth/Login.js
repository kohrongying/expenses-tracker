import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { login, logout } from "../../actions";
import firebase from "firebase/app";
import "firebase/auth";

const provider = new firebase.auth.GoogleAuthProvider();

class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
  }

  login = () => {
    firebase.auth().signInWithRedirect(provider)
      .then((result)=>{
        const user = result.user;
        this.props.login(user.uid);
      })
      // eslint-disable-next-line no-console
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <Button onClick={this.login}>Login</Button>
      </div>
    );
  }
}


export default connect(null, { login, logout })(Login);