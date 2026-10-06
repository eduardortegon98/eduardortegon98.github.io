import React from "react";

const LoginHeader = () => {
  return (
    <div className="text-center">

      <h1 className=" text-4xl font-extrabold">
        Iniciar sesión
      </h1>

      <p className="mt-3 text-[var(--color-text-muted)]">
        Accede a tu panel de administración.
      </p>
    </div>
  );
};

export default LoginHeader;