import { Localized } from "../i18n/Language";
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
    <Localized as="footer" className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* glow suave abajo */}
      <Localized as="div" className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[var(--color-primary)]/20 blur-3xl sm:h-24" />

      <Localized as="div" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
        <Localized as="div" className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <Localized as="div" className="text-center md:text-left">
            <Localized as="p" className="text-base font-extrabold tracking-tight text-[var(--color-text)] sm:text-lg">
              Soluciones Tecnológicas{" "}
              <Localized as="span" className="text-[var(--color-text-muted)]">Ortegón</Localized>
            </Localized>
            <Localized as="p" className="mt-1 text-sm text-[var(--color-text-muted)]">© {year}</Localized>
          </Localized>

          {/* Neon pill */}
          <Localized as="div" className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)]/12 px-3 py-3 ring-1 ring-[var(--color-accent)]/25 sm:rounded-full sm:px-4 sm:py-2">
            {socials.map(({ label, href, Icon }) => (
              <Localized as="a"
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="
                  group inline-flex h-10 w-10 items-center justify-center rounded-full
                  bg-[var(--color-bg-secondary)] ring-1 ring-[var(--color-border)] transition hover:bg-[var(--color-bg-secondary)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/60
                  sm:h-10 sm:w-10
                "
              >
                <Icon className="text-[17px] text-[var(--color-text-muted)] transition group-hover:text-[var(--color-text)] sm:text-[18px]" />
              </Localized>
            ))}

            <Localized as="button"
              onClick={scrollToTop}
              className="
                inline-flex items-center gap-2 rounded-full
                bg-[var(--color-primary)]/90 px-4 py-2 text-sm font-extrabold text-[var(--color-text)]
                transition hover:bg-[var(--color-primary)]
                shadow-[0_16px_50px_-30px_rgba(192,253,185,0.95)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border)]
                sm:ml-1
              "
            >
              Arriba <Localized as="span" className="-mt-px">↑</Localized>
            </Localized>
          </Localized>
        </Localized>
      </Localized>
    </Localized>
  );
};

export default Footer;
