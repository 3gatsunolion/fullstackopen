import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // `getDerivedStateFromError` and `componentDidCatch` are lifecycle methods that React calls internally
  // when an error occurs during rendering, lifecycle methods, or constructors of child components.
  // Function components don't have an equivalent API. React never introduced hooks such as:
  // useDidCatch(error)
  // useErrorBoundary()
  // What happens here is:
  // - Child throws during render.
  // - React walks up the tree looking for an error boundary.
  // - React calls:
  //   - getDerivedStateFromError
  //   - componentDidCatch
  // Boundary updates its state and renders fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong :(</h2>
          <p>{this.state.error.message}</p>
          {/* <button onClick={() => this.setState({ hasError: false, error: null })}>
            try again
          </button> */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
