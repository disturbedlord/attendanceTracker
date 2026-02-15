import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { NavbarProvider } from "./context/NavbarContext";
import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    console.log("New version available");
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <NavbarProvider>
          <App />
        </NavbarProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
);
