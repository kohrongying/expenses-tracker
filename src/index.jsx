import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import * as Sentry from "@sentry/browser";
import { registerSW } from "virtual:pwa-register";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "https://a875dec620d14f6b8b364f5da2db8569@sentry.io/1545494",
  });

  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm("New content available. Reload?")) {
        updateSW(true);
      }
    },
  });
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
