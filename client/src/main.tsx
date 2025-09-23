import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SaveProvider } from "./context/SaveProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SaveProvider>
      <App />
    </SaveProvider>
  </StrictMode>
);
