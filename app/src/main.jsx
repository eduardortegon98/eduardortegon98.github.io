import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import { LanguageProvider } from "./i18n/Language";
import App from "./App.jsx";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Analytics from "./components/Analytics";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider><App /><Analytics /></LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
