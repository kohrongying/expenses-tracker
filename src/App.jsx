import React, { lazy, Suspense, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/auth";
import { Switch, Route } from "react-router-dom";
const Expense = lazy(() => import("./components/Expense/Expense"));
const AddExpenseForm = lazy(
  () => import("./components/Expense/AddExpenseForm")
);
const Income = lazy(() => import("./components/Income/Income"));
const AddIncomeForm = lazy(() => import("./components/Income/AddIncomeForm"));
const Investment = lazy(() => import("./components/Investment/Investment"));
const AddInvestmentForm = lazy(
  () => import("./components/Investment/AddInvestmentForm")
);
const Profile = lazy(() => import("./components/Profile/Profile"));
import PrivateRoute from "./components/Auth/PrivateRoute";
import Home from "./Home";

import useAuthStore from "./store/authStore";

const env = import.meta.env;
const prodConfig = {
  apiKey: env.VITE_PROD_API_KEY,
  authDomain: env.VITE_PROD_AUTH_DOMAIN,
  databaseURL: env.VITE_PROD_DATABASE_URL,
  projectId: env.VITE_PROD_PROJECT_ID,
  storageBucket: env.VITE_PROD_STORAGE_BUCKET,
  messagingSenderId: env.VITE_PROD_MESSAGING_SENDER_ID,
  appId: env.VITE_PROD_APP_ID,
};

var devConfig = {
  apiKey: env.VITE_STAGING_API_KEY,
  authDomain: env.VITE_STAGING_AUTH_DOMAIN,
  databaseURL: env.VITE_STAGING_DATABASE_URL,
  projectId: env.VITE_STAGING_PROJECT_ID,
  storageBucket: env.VITE_STAGING_STORAGE_BUCKET,
  messagingSenderId: env.VITE_STAGING_MESSAGING_SENDER_ID,
  appId: env.VITE_STAGING_APP_ID,
};

const config = import.meta.env.PROD === "production" ? prodConfig : devConfig;

firebase.initializeApp(config);

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <React.Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute exact path="/expenses" component={Expense} />
          <PrivateRoute exact path="/expenses/new" component={AddExpenseForm} />
          <PrivateRoute exact path="/income" component={Income} />
          <PrivateRoute exact path="/income/new" component={AddIncomeForm} />
          <PrivateRoute exact path="/investment" component={Investment} />
          <PrivateRoute
            exact
            path="/investment/new"
            component={AddInvestmentForm}
          />
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/" component={Home} />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
