import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useTheme } from "../context/ThemeContext";
import Logo from "../../public/Soluciones_Tecnologicas_Ortegon.png";
import { Moon, Sun } from "lucide-react";

const navItems = [
  { label: "Log In", href: "/login" },
  { label: "Contacto", href: "/contacto" },
];

const Header = () => {
  const { theme, setTheme } = useTheme();

  const location = useLocation();

  const [active, setActive] = useState(location.pathname);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "corporate" : "dark"));
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-r from-cyan-400/15 via-sky-400/15 to-blue-500/15 blur-3xl" />

      {/* Barra principal */}
      <div
        className={`
    border-b border-white/10 shadow-lg backdrop-blur-xl
    ${theme === "dark" ? "bg-black/80" : "bg-[#474B4E]/80"}
  `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Branding */}
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              <img
                src={Logo}
                alt="Soluciones Tecnológicas Ortegón"
                className="h-12 w-12 rounded-xl border-2 border-[#C0FDB9] object-contain shadow-md"
              />

              <div className="text-white">
                <p className="text-lg font-extrabold tracking-tight">
                  Soluciones Tecnológicas Ortegón
                </p>

                <p className="text-sm text-[#C0FDB9]/90">
                  Ingeniería, software e IA para tu negocio.
                </p>
              </div>
            </Link>

            {/* Desktop */}
            <div className="hidden items-center gap-6 md:flex">
              <nav className="flex items-center gap-4">
                {navItems.map((item) => {
                  const isActive = active === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={[
                        "relative px-3 py-2 font-medium transition-all duration-200",
                        isActive
                          ? "text-[#C0FDB9] underline decoration-[#C0FDB9]/70 underline-offset-4"
                          : "text-white/70 hover:text-[#C0FDB9] hover:underline hover:decoration-cyan-300",
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
                  rounded-full bg-[#C0FDB9]
                  px-5 py-2.5 text-sm font-bold text-black
                  shadow-lg transition
                  hover:brightness-110
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#C0FDB9]/50
                "
              >
                Cotizar
              </Link>

              <button
                onClick={toggleTheme}
                className="
    inline-flex items-center gap-2
    rounded-xl bg-[#C0FDB9]
    px-4 py-2 text-sm font-semibold text-black
    transition hover:brightness-110
  "
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={18} />
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                  </>
                )}
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="text-2xl text-white focus:outline-none md:hidden"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="border-t border-white/20 bg-black/90 backdrop-blur-lg md:hidden">
            <nav className="flex flex-col gap-2 px-4 py-4">
              {navItems.map((item) => {
                const isActive = active === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "block rounded-lg px-3 py-2 text-sm font-semibold transition",
                      isActive
                        ? "bg-[#C0FDB9]/30 text-[#C0FDB9]"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                to="/cotizar"
                onClick={() => setOpen(false)}
                className="
                  mt-2 block rounded-lg
                  bg-[#C0FDB9]
                  px-4 py-3 text-center
                  text-sm font-bold text-black
                  transition hover:brightness-110
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
                  bg-[#C0FDB9]
                  px-4 py-3 text-sm font-bold text-black
                  transition hover:brightness-110
                "
              >
                {theme === "dark" ? "Modo corporativo" : "Modo oscuro"}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
