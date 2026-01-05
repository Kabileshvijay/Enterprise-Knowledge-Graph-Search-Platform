import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { SnowProvider } from "./context/SnowContext";
import SnowLayer from "./effects/SnowLayer.jsx";
import Snowfall from "react-snowfall";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SnowProvider>
        <SnowLayer />
        <App />
      </SnowProvider>
    </BrowserRouter>
  </React.StrictMode>
);
