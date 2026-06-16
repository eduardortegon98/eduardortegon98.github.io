import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import Logo from "../../public/Soluciones_Tecnologicas_Ortegon.png";

const navItems = [
  { label: "Log In", href: "/login" },
  { label: "Contacto", href: "/contacto" },
];

const Header = () => {
  const { theme, setTheme } = useTheme();

  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onEsc);

    return () => {
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "corporate" : "dark"));
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-r from-cyan-400/15 via-sky-400/15 to-blue-500/15 blur-3xl" />

      {/* Barra principal */}
      <div
        className="
          border-b border-[var(--color-border)]
          bg-[var(--color-bg)]
          shadow-lg backdrop-blur-xl
        "
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Branding */}
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <img
                src={Logo}
                alt="Soluciones Tecnológicas Ortegón"
                className="
                  h-12 w-12 rounded-xl
                  border-2 border-[var(--color-primary)]
                  object-contain shadow-md
                "
              />

              <div className="hidden sm:block text-[var(--color-text)]">
                <p className="text-lg font-extrabold tracking-tight">
                  Soluciones Tecnológicas Ortegón
                </p>

                <p className="text-sm text-[var(--color-primary)]">
                  Ingeniería, software e IA para tu negocio.
                </p>
              </div>
            </Link>

            {/* Desktop */}
            <div className="hidden items-center gap-6 md:flex">
              <nav className="flex items-center gap-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={[
                        "relative px-3 py-2 font-medium transition-all duration-200",
                        isActive
                          ? "text-[var(--color-primary)] underline decoration-[var(--color-primary)] underline-offset-4"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)]",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <Link
                to="/cotizar"
                className="
                  rounded-full
                  bg-[var(--color-primary)]
                  px-5 py-2.5
                  text-sm font-bold text-black
                  shadow-lg transition
                  hover:bg-[var(--color-primary-hover)]
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--color-primary)]
                "
              >
                Cotizar
              </Link>

              <button
                onClick={toggleTheme}
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-[var(--color-primary)]
                  px-4 py-2
                  text-sm font-semibold text-black
                  transition
                  hover:bg-[var(--color-primary-hover)]
                "
              >
                {theme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="
                text-2xl
                text-[var(--color-text)]
                focus:outline-none
                md:hidden
              "
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div
            className="
              border-t border-[var(--color-border-strong)]
              bg-[var(--color-surface)]
              backdrop-blur-lg
              md:hidden
            "
          >
            <nav className="flex flex-col gap-2 px-4 py-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={[
                      "block rounded-lg px-3 py-2 text-sm font-semibold transition",
                      isActive
                        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                        : "text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text)]",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                to="/cotizar"
                className="
                  mt-2 block rounded-lg
                  bg-[var(--color-primary)]
                  px-4 py-3 text-center
                  text-sm font-bold text-black
                  transition
                  hover:bg-[var(--color-primary-hover)]
                "
              >
                Cotizar
              </Link>

              <button
                onClick={() => {
                  toggleTheme();
                  setOpen(false);
                }}
                className="
                  mt-2 rounded-lg
                  bg-[var(--color-primary)]
                  px-4 py-3
                  text-sm font-bold text-black
                  transition
                  hover:bg-[var(--color-primary-hover)]
                "
              >
                {theme === "dark"
                  ? "Modo corporativo"
                  : "Modo oscuro"}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;