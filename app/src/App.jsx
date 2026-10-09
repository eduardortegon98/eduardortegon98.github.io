import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext.jsx";

const Portal = lazy(() => import("./Portal/Portal.jsx"));
const AnalyticsDashboard = lazy(() => import("./Analytics/AnalyticsDashboard.jsx"));
const Inbox = lazy(() => import("./Inbox/Inbox.jsx"));
const Home = lazy(() => import("./Home/Home.jsx"));
const Login = lazy(() => import("./Login/Login.jsx"));
const Contacto = lazy(() => import("./Contacto/Contacto.jsx"));
const Cotizar = lazy(() => import("./Cotizar/Cotizar.jsx"));

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/panel" element={<Portal />} />
        <Route path="/panel/analitica" element={<AnalyticsDashboard />} />
        <Route path="/panel/mensajes" element={<Inbox />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/cotizar" element={<Cotizar />} />
      </Routes>
    </Suspense>
  );
}

export default App;
