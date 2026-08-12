import type { ComponentType } from "react";
import {
  Route,
  Redirect,
  type RouteComponentProps,
  type RouteProps,
} from "react-router-dom";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import useAuthStore from "@/store/authStore";

interface PrivateRouteProps extends Omit<
  RouteProps,
  "component" | "render" | "children"
> {
  component: ComponentType<RouteComponentProps>;
}

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
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
