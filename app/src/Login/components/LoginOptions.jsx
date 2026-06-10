import React from "react";

const LoginOptions = () => {
  return (
    <div className="flex items-center justify-between text-sm">
      <label className="flex items-center gap-2 text-white/70">
        <input
          type="checkbox"
          className="rounded border-white/20 bg-black"
        />

        Recordarme
      </label>

      <button
        type="button"
        className="text-[#C0FDB9] hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </button>
    </div>
  );
};

export default LoginOptions;