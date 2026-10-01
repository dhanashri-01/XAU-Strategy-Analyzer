import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { BacktestProvider } from "./context/BacktestContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BacktestProvider>
        <App />
      </BacktestProvider>
    </BrowserRouter>
  </StrictMode>
);