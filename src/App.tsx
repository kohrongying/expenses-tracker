import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { Toaster } from "sonner";
import PrivateRoute from "./features/auth/PrivateRoute";
import Home from "./HomePage";
import SplashScreen from "./components/ui/SplashScreen";
import useAuthStore from "./store/authStore";

const Expense = lazy(() => import("./features/expense/ListExpensePage"));
const AddExpenseForm = lazy(() => import("./features/expense/AddExpensePage"));
const Analytics = lazy(() => import("./features/analytics/AnalyticsPage"));

// runs initializeApp once
import "./firebase";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isAuthLoading) {
    return <SplashScreen />;
  }

  return (
    <React.Fragment>
      <Toaster
        toastOptions={{
          classNames: {
            toast: "bg-card text-foreground border-border",
            success: "bg-primary/10 text-primary border-primary/20",
            error: "bg-destructive/10 text-destructive border-destructive/20",
          },
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute exact path="/expenses" component={Expense} />
          <PrivateRoute exact path="/expenses/new" component={AddExpenseForm} />
          <PrivateRoute exact path="/analytics" component={Analytics} />
          <Route path="/" component={Home} />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
