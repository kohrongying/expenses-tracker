import React from "react";
import { Route, Redirect } from "react-router-dom";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import useAuthStore from "@/store/authStore";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  return (
    <ErrorBoundary>
      <Route
        {...rest}
        render={(props) =>
          isLoading ? (
            <div>Loading...</div>
          ) : user ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    </ErrorBoundary>
  );
};
export default PrivateRoute;
