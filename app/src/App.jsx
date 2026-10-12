import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { portalModules } from "./Portal/modules.jsx";
import ModuleRoute from "./Portal/ModuleRoute.jsx";
import { useTheme } from "./context/ThemeContext.jsx";

const PortalLayout = lazy(() => import("./Portal/PortalLayout.jsx"));
const PortalHome = lazy(() => import("./Portal/PortalHome.jsx"));
const Account = lazy(() => import("./Portal/Account.jsx"));
const AnalyticsDashboard = lazy(() => import("./Analytics/AnalyticsDashboard.jsx"));
const Assignments = lazy(() => import("./Portal/Assignments.jsx"));
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
        <Route path="/panel" element={<PortalLayout />}>
          <Route index element={<PortalHome />} />
          <Route path="cuenta" element={<Account />} />
          <Route path="analitica" element={<AnalyticsDashboard />} />
          {portalModules.map(module=><Route key={module.id} path={module.path.replace('/panel/','')} element={<ModuleRoute id={module.id}/>}/>)}
          <Route path="asignaciones" element={<Assignments />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/cotizar" element={<Cotizar />} />
      </Routes>
    </Suspense>
  );
}

export default App;
