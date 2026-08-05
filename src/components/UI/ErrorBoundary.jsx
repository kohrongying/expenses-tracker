import React, { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
  }

  render() {
    const { error, errorInfo } = this.state;

    if (errorInfo) {
      return (
        <React.Fragment>
          <h2>Something went wrong</h2>
          <div>
            <details style={{ whiteSpace: "pre-wrap" }}>
              {error && error.toString()}
              <br />
              {errorInfo.componentStack}
            </details>
          </div>
        </React.Fragment>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
