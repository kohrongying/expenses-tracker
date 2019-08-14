import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/auth";
import { Switch, Route } from "react-router-dom";
import History from "./components/History/History";
import Expense from "./components/Expense/Expense";
import AddExpenseForm from "./components/Expense/AddExpenseForm";
import Income from "./components/Income/Income";
import AddIncomeForm from "./components/Income/AddIncomeForm";
import Investment from "./components/Investment/Investment";
import AddInvestmentForm from "./components/Investment/AddInvestmentForm";
import Profile from "./components/Profile/Profile";
import MonthlyBreakdown from "./components/History/MonthlyBreakdown";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Home from "./Home";

import { connect } from "react-redux";
import { login } from "./actions";

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

class App extends Component {

  static propTypes = {
    login: PropTypes.func.isRequired,
  }

  state = {
    loading: false,
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
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute exact path="/expenses" component={Expense} />
          <PrivateRoute exact path="/expenses/new" component={AddExpenseForm} />
          <PrivateRoute path="/history" component={History} />
          <PrivateRoute exact path="/income" component={Income} />
          <PrivateRoute exact path="/income/new" component={AddIncomeForm} />
          <PrivateRoute exact path="/investment" component={Investment} />
          <PrivateRoute exact path="/investment/new" component={AddInvestmentForm} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/:year/:month" component={MonthlyBreakdown} />
          <Route path="/" component={Home} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default connect(null, { login })(App);