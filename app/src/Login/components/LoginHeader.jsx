import React from "react";

const LoginHeader = () => {
  return (
    <div className="text-center">
      <span
        className="
          inline-flex rounded-full
          border border-[#C0FDB9]/30
          bg-[#C0FDB9]/10
          px-4 py-1
          text-sm font-medium text-[#C0FDB9]
        "
      >
        Área privada
      </span>

      <h1 className="mt-6 text-4xl font-extrabold">
        Iniciar sesión
      </h1>

      <p className="mt-3 text-white/70">
        Accede a tu panel de administración.
      </p>
    </div>
  );
};

export default LoginHeader;