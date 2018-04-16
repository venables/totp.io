"use strict";

import "./style.css";
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
      </div>
    );
  }
}

ReactDOM.render(
  <OTPComponent otp-key="OVEK7TIJ3A3DM3M6" />,
  document.getElementById("app")
);

module.hot.accept();
