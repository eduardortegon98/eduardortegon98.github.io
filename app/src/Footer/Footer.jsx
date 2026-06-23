import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { animate } from "framer-motion";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/solucionestecnologicasortegon",
    Icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/daniedu150/",
    Icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/eduardortegon/",
    Icon: FaLinkedinIn,
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollToTop = (e) => {
    e.preventDefault();

    animate(window.scrollY, 0, {
      duration: 1.2,
      ease: "easeInOut",
      onUpdate: (latest) => {
        window.scrollTo(0, latest);
      },
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0b0d12]">
      {/* glow suave abajo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[#C0FDB9]/20 blur-3xl sm:h-24" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
        <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="text-base font-extrabold tracking-tight text-white sm:text-lg">
              Soluciones Tecnológicas{" "}
              <span className="text-white/85">Ortegón</span>
            </p>
            <p className="mt-1 text-sm text-white/60">© {year}</p>
          </div>

          {/* Neon pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-[#C0FDB9]/12 px-3 py-3 ring-1 ring-[#C0FDB9]/25 sm:rounded-full sm:px-4 sm:py-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="
                  group inline-flex h-10 w-10 items-center justify-center rounded-full
                  bg-black/30 ring-1 ring-white/10 transition hover:bg-black/45
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C0FDB9]/60
                  sm:h-10 sm:w-10
                "
              >
                <Icon className="text-[17px] text-white/80 transition group-hover:text-white sm:text-[18px]" />
              </a>
            ))}

            <button
              onClick={scrollToTop}
              className="
                inline-flex items-center gap-2 rounded-full
                bg-[#C0FDB9]/90 px-4 py-2 text-sm font-extrabold text-black
                transition hover:bg-[#C0FDB9]
                shadow-[0_16px_50px_-30px_rgba(192,253,185,0.95)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
                sm:ml-1
              "
            >
              Arriba <span className="-mt-px">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
