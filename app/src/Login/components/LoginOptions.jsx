import { Localized } from "../../i18n/Language";
import React from "react";

const LoginOptions = () => {
  return (
    <Localized as="div" className="flex items-center justify-between text-sm">
      <Localized as="label" className="flex items-center gap-2 text-[var(--color-text-muted)]">
        <Localized as="input"
          type="checkbox"
          className="rounded border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
        />

        Recordarme
      </Localized>

      <Localized as="button"
        type="button"
        className="text-[var(--color-accent)] hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </Localized>
    </Localized>
  );
};

export default LoginOptions;