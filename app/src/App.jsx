import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./Home/Home.jsx"));
const Login = lazy(() => import("./Login/Login.jsx"));
const Contacto = lazy(()=> import("./Contacto/Contacto.jsx"));
const Cotizar = lazy(() => import ("./Cotizar/Cotizar.jsx") )

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/cotizar" element={<Cotizar />} />
      </Routes>
    </Suspense>
  );
}

export default App;
