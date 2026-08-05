import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
const Expense = lazy(() => import("./components/Expense/Expense"));
const AddExpenseForm = lazy(
  () => import("./components/Expense/AddExpenseForm")
);
const Profile = lazy(() => import("./components/Profile/Profile"));
import PrivateRoute from "./components/Auth/PrivateRoute";
import Home from "./Home";

import useAuthStore from "./store/authStore";

import "./firebase"; // runs initializeApp once

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
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/" component={Home} />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
