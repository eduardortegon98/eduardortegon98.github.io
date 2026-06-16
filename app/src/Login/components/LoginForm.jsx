import React from "react";
import { Mail, Lock } from "lucide-react";

import InputField from "./InputField";
import LoginOptions from "./LoginOptions";

const LoginForm = () => {
  return (
    <form className="mt-10 space-y-5">
      <InputField
        label="Correo electrónico"
        type="email"
        placeholder="correo@empresa.com"
        icon={Mail}
      />

      <InputField
        label="Contraseña"
        type="password"
        placeholder="Ingrese su contraseña"
        icon={Lock}
      />

      <LoginOptions />

      <button
        type="submit"
        className="
          w-full
          rounded-lg
          bg-[#C0FDB9]
          px-6 py-3.5
          text-sm font-semibold tracking-wide text-black
          transition-colors duration-200
          hover:bg-[#B4F6AC]
          focus:outline-none
          focus:ring-2 focus:ring-[#C0FDB9]/40
        "
      >
        Iniciar sesión
      </button>
    </form>
  );
};

export default LoginForm;