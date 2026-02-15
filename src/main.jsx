import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { NavbarProvider } from "./context/NavbarContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NavbarProvider>
          <App />
        </NavbarProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
