import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard panel failed:", error, errorInfo);
  }

  reset() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100" role="alert">
          <h2 className="font-black">This panel could not be displayed.</h2>
          <p className="mt-1 text-sm">The rest of your dashboard is still available.</p>
          <button className="mt-4 rounded-lg bg-red-700 px-4 py-2 font-bold text-white" type="button" onClick={this.reset}>Try Again</button>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
