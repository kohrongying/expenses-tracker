import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import ErrorBoundary from "../UI/ErrorBoundary";

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <ErrorBoundary>
    <Route
      {...rest}
      render={props => (
        isAuthenticated && <Component {...props} />
      )}
    />
  </ErrorBoundary>
);

PrivateRoute.propTypes = {
  component: PropTypes.any,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({ isAuthenticated: state.user.isAuthenticated });

export default connect(mapStateToProps)(PrivateRoute);