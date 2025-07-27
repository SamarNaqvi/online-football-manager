import React, { Component } from "react";
import { Result } from "antd";
import { LOGIN_PATH } from "../../constant/appPaths";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="Something went wrong!"
          subTitle="Please refresh your page or try again later."
          extra={
            <a className="cursor-pointer" href={`${LOGIN_PATH}`}>
              Reload
            </a>
          }
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
