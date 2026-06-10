import React from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";

import InputField from "./InputField";
import LoginOptions from "./LoginOptions";

const LoginForm = () => {
  return (
    <form className="mt-10 space-y-6">
      <InputField
        label="Correo electrónico"
        type="email"
        placeholder="correo@empresa.com"
        icon={Mail}
      />

      <InputField
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        icon={Lock}
      />

      <LoginOptions />

      <button
        type="submit"
        className="
          inline-flex w-full items-center justify-center gap-2
          rounded-2xl bg-[#C0FDB9]
          px-6 py-4 font-bold text-black
          transition hover:brightness-110
        "
      >
        Ingresar
        <ArrowRight size={20} />
      </button>
    </form>
  );
};

export default LoginForm;
