import { Localized } from "../i18n/Language";
import React from "react";

import LoginForm from "./components/LoginForm";
import Header from "../Header/Header";

function Login() {
  return (
    <Localized as="div"
      className="
    relative
    overflow-hidden
    bg-[var(--color-bg-secondary)]
    text-[var(--color-text)]
  "
    >
      <Header />

      <Localized as="main" className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-10">
        <Localized as="div" className="relative w-full max-w-lg">
          {/* Borde exterior */}
          <Localized as="div" className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-white/20" />

          {/* Card */}
          <Localized as="div" className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-[0_14px_40px_rgba(32,58,43,0.08)]">
            {/* Barra superior */}
            <Localized as="div" className="flex items-center gap-2 border-b border-[var(--color-border)] px-6 py-4">
              <Localized as="div" className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
              <Localized as="div" className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
              <Localized as="div" className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />

              <Localized as="span" className="ml-3 text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
                Acceso a tu cuenta
              </Localized>
            </Localized>

            <Localized as="div" className="p-8 md:p-10">
              <LoginForm />
            </Localized>
          </Localized>
        </Localized>
      </Localized>
    </Localized>
  );
}

export default Login;
