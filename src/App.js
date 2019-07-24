import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import { Switch, Link } from "react-router-dom";
import History from "./components/History/History";
import Home from "./components/Home";
import Income from "./components/Income/Income";
import Investment from "./components/Investment/Investment";
import MonthlyBreakdown from "./components/History/MonthlyBreakdown";
import { connect } from "react-redux";
import { login, logout } from "./actions";
import PrivateRoute from "./components/Auth/PrivateRoute";

const env = process.env;
const prodConfig = {
  apiKey: env.REACT_APP_PROD_API_KEY,
  authDomain: env.REACT_APP_PROD_AUTH_DOMAIN,
  databaseURL: env.REACT_APP_PROD_DATABASE_URL,
  projectId: env.REACT_APP_PROD_PROJECT_ID,
  storageBucket: env.REACT_APP_PROD_STORAGE_BUCKET,
  messagingSenderId: env.REACT_APP_PROD_MESSAGING_SENDER_ID
};

var devConfig = {
  apiKey: env.REACT_APP_STAGING_API_KEY,
  authDomain: env.REACT_APP_STAGING_AUTH_DOMAIN,
  databaseURL: env.REACT_APP_STAGING_DATABASE_URL,
  projectId: env.REACT_APP_STAGING_PROJECT_ID,
  storageBucket: env.REACT_APP_STAGING_STORAGE_BUCKET,
  messagingSenderId: env.REACT_APP_STAGING_MESSAGING_SENDER_ID,
  appId: env.REACT_APP_STAGING_APP_ID,
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

firebase.initializeApp(config);
const provider = new firebase.auth.GoogleAuthProvider();

class App extends Component {

  static propTypes = {
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  state = {
    loading: false,
  }

  login = () => {
    firebase.auth().signInWithRedirect(provider)
      .then((result)=>{
        this.props.login(result.user.uid);
      })
      // eslint-disable-next-line no-console
      .catch(err => console.log(err));
  }

  logout = () => {
    firebase.auth().signOut()
      .then(() => this.props.logout() );
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        this.props.login(user.uid);
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <nav className="navbar navbar-expand-lg navbar-light">
            <a href="/" className="navbar-brand">Expense Tracker</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              {this.props.isAuthenticated ? (
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to='/' className="nav-link">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link to='/history' className="nav-link">History</Link>
                  </li>
                  <li className="nav-item">
                    <Link to='/income' className="nav-link">Income</Link>
                  </li>
                  <li className="nav-item">
                    <Link to='/investment' className="nav-link">Investment</Link>
                  </li>
                  <li className="nav-item">
                    <div className="nav-link" onClick={this.logout}>Log Out</div>
                  </li>
                </ul>
              ) : (
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <div className="nav-link" onClick={this.login}>Log In</div>
                  </li>
                </ul>
              )}
            </div>

          </nav>

          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute path="/history" component={History} />
            <PrivateRoute path="/income" component={Income} />
            <PrivateRoute path="/investment" component={Investment} />
            <PrivateRoute path="/:year/:month" component={MonthlyBreakdown} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({ isAuthenticated: state.user.isAuthenticated });

export default connect(mapStateToProps, { login, logout })(App);