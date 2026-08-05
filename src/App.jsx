import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
const Expense = lazy(() => import("./features/expense/ListExpensePage"));
const AddExpenseForm = lazy(
  () => import("./features/expense/AddExpensePage")
);
const Profile = lazy(() => import("./features/profile/ProfilePage"));
import PrivateRoute from "./features/auth/PrivateRoute";
import Home from "./HomePage";

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
