"use strict";

import "./style.css";
import React from "react";
import ReactDOM from "react-dom";

const title = "🚀";

ReactDOM.render(<h1>{title}</h1>, document.getElementById("app"));

module.hot.accept();
