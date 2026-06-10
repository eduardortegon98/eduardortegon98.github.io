import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../public/Soluciones_Tecnologicas_Ortegon.png";

const navItems = [
  { label: "Log In", href: "/login" },
  { label: "Contacto", href: "/contacto" },
];

const Header = () => {
  const location = useLocation();

  const [active, setActive] = useState(location.pathname);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setOpen(false);

    window.addEventListener("keydown", onEsc);

    return () => {
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Glow ligero acorde Hero */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-r from-cyan-400/15 via-sky-400/15 to-blue-500/15 blur-3xl" />

      {/* Barra principal */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Branding */}
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
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

            {/* Desktop Nav + CTA */}
            <div className="hidden md:flex items-center gap-6">
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
                  px-5 py-2.5 text-sm font-bold
                  bg-[#C0FDB9] text-black
                  rounded-full shadow-lg
                  hover:brightness-110 transition
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C0FDB9]/50
                "
              >
                Cotizar
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden text-white text-2xl focus:outline-none"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-black/90 backdrop-blur-lg border-t border-white/20">
            <nav className="flex flex-col gap-2 px-4 py-4">
              {navItems.map((item) => {
                const isActive = active === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "block px-3 py-2 rounded-lg text-sm font-semibold transition",
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
                  block mt-2 px-4 py-3 text-center text-sm font-bold
                  bg-[#C0FDB9] text-black rounded-lg
                  hover:brightness-110 transition
                "
              >
                Cotizar
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;