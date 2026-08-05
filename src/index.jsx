import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "antd/dist/antd.css";
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://a875dec620d14f6b8b364f5da2db8569@sentry.io/1545494",
});

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
