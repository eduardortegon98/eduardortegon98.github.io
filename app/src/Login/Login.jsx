import React from "react";

import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import Header from "../Header/Header";

function Login() {
  return (
    <div
      className="
    relative
    overflow-hidden
    rounded-2xl
    bg-gray-300
    shadow-[0_10px_30px_rgba(0,0,0,0.08),0_30px_60px_rgba(0,0,0,0.12)]
    text-white
  "
    >
      <Header />

      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
        <div className="relative w-full max-w-lg">
          {/* Borde exterior */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-white/20" />

          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl bg-[#3F4346] shadow-2xl">
            {/* Barra superior */}
            <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
              <div className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />

              <span className="ml-3 text-xs uppercase tracking-[0.3em] text-white/50">
                Authentication
              </span>
            </div>

            <div className="p-8 md:p-10">
              <LoginHeader />

              <div className="mt-8">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
