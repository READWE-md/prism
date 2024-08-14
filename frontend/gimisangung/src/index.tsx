import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// import rootReducer from "./reducer";
// import { Provider } from "react-redux";
// import { configureStore } from "@reduxjs/toolkit";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const $root = document.getElementById("root");
if ($root) {
  $root.addEventListener("contextmenu", (event: MouseEvent) => {
    event.preventDefault();
  });
}
// const store = configureStore({ reducer: rootReducer });
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
