import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import "./index.css";
import "antd/dist/antd.css";
import * as serviceWorker from "./serviceWorker";
import * as Sentry from "@sentry/browser";

let store = createStore(reducers, applyMiddleware(thunk));

Sentry.init({ dsn: "https://a875dec620d14f6b8b364f5da2db8569@sentry.io/1545494" });

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById("root"));

serviceWorker.register();