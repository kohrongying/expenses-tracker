import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <React.Fragment>
          <Typography variant="h4" gutterBottom component="h2">
            Something went wrong
          </Typography>
          <Typography component="div">
            <details style={{ whiteSpace: "pre-wrap" }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          </Typography>
        </React.Fragment>
      );
    }
    // Render children if there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;