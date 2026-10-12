import { MotionConfig } from "framer-motion";
import "./components/Motion.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import { LanguageProvider } from "./i18n/Language";
import App from "./App.jsx";
import "./App.css";
import "./components/CompactActions.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Analytics from "./components/Analytics";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider><MotionConfig reducedMotion="user" transition={{duration:0.48,ease:[0.22,1,0.36,1]}}><App /><Analytics /></MotionConfig></LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
