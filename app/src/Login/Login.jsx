import React from "react";

import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import Header from "../Header/Header";

function Login() {
  return (
    <div className="bg-[#474B4E] text-white">
      <Header />
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-10">
          <LoginHeader />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
