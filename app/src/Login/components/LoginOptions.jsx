import React from "react";

const LoginOptions = () => {
  return (
    <div className="flex items-center justify-between text-sm">
      <label className="flex items-center gap-2 text-[var(--color-text-muted)]">
        <input
          type="checkbox"
          className="rounded border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
        />

        Recordarme
      </label>

      <button
        type="button"
        className="text-[var(--color-accent)] hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </button>
    </div>
  );
};

export default LoginOptions;