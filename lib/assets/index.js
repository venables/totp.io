"use strict";

import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import TOTP from "./totp";

class OTPComponent extends React.Component {
  static get propTypes() {
    return {
      "otp-key": PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);

    const totp = new TOTP(this.props["otp-key"]);

    this.state = {
      totp: totp,
      totpKey: totp.otpKey(),
      seconds: totp.timeRemaining
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    const totp = this.state.totp;
    const timeRemaining = totp.timeRemaining;

    this.setState(prevState => ({
      seconds: timeRemaining,
      totpKey: timeRemaining === 30 ? totp.otpKey() : prevState.totpKey
    }));
  }

  render() {
    return (
      <div className="container token-show">
        <div className="jumbotron">
          <h1 id="otp">{this.state.totpKey}</h1>
          <p className="lead">
            Updating in: <span id="updatingIn">{this.state.seconds}</span>
          </p>
        </div>
        <Footer />
      </div>
    );
  }
}

class OTPForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "OVEK7TIJ3A3DM3M6"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    window.location.href = `/${this.state.value}`;
  }

  render() {
    return (
      <div className="container home-index">
        <header>
          <div className="logo">
            <a href="/">totp.io</a>
          </div>
        </header>
        <div className="jumbotron">
          <h1>One-time passwords in your browser</h1>
          <hr />
          <p>Just type your TOTP seed and see your one time passcode:</p>
          <form onSubmit={this.handleSubmit}>
            <p>
              <input
                type="text"
                value={this.state.value}
                placeholder={this.state.value}
                onChange={this.handleChange}
              />
            </p>
            <p>
              <button type="submit" className="btn btn-success btn-lg">
                Get my code
              </button>
            </p>
          </form>
        </div>
        <Footer />
      </div>
    );
  }
}

class Footer extends React.Component {
  constructor(...args) {
    super(...args);

    /*global VERSION DATE */
    this.state = {
      version: VERSION,
      date: DATE
    };
  }

  render() {
    return (
      <footer className="footer">
        <p>
          <strong>totp.io</strong> is open-source and free to use. Check out the
          source on&nbsp;
          <a href="https://github.com/venables/totp.io">Github</a>.
        </p>
        <p>
          Made with ❤️ by&nbsp;
          <a href="https://blendist.com">Blendist</a> in Boston, MA.
        </p>
        <p className="version">
          v{this.state.version}-{this.state.date}
        </p>
      </footer>
    );
  }
}

const otpKey = window.location.pathname.replace(/\//g, "");

if (otpKey.length) {
  ReactDOM.render(
    <OTPComponent otp-key={otpKey} />,
    document.getElementById("app")
  );
} else {
  ReactDOM.render(<OTPForm />, document.getElementById("app"));
}

module.hot.accept();
