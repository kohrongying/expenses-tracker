import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./features/auth/PrivateRoute";
import Home from "./HomePage";
import useAuthStore from "./store/authStore";

const Expense = lazy(() => import("./features/expense/ListExpensePage"));
const AddExpenseForm = lazy(
  () => import("./features/expense/AddExpensePage")
);

// runs initializeApp once
import "./firebase"; 

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
          <Route path="/" component={Home} />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
