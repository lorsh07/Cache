import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRoot } from "./AppRoot.tsx";
import { AuthProvider } from "./store/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  </StrictMode>
);
