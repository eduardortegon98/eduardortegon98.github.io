import { ChevronDown } from "lucide-react";
import Logo from "../../public/Soluciones_Tecnologicas_Ortegon.png";
import { animate } from "framer-motion";

import { useTheme } from "../context/ThemeContext";
import ImageHero from "../assets/zeus_milo.png";

const Hero = () => {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const goTo = (id) => {
    const el = document.getElementById(id);

    if (!el) return;

    const start = window.scrollY;
    const end = el.offsetTop;

    animate(start, end, {
      duration: 1.2,
      ease: "easeInOut",
      onUpdate: (value) => {
        window.scrollTo(0, value);
      },
    });
  };

  return (
    <section
      className="
        relative min-h-[calc(100svh-64px)]
        w-full overflow-hidden
        bg-[var(--color-bg-secondary)]
        opacity-90
      "
    >
      <button
        type="button"
        onClick={() => goTo("products")}
        className="
    absolute bottom-8 left-1/2 z-20
    -translate-x-1/2
    rounded-full
    bg-[var(--color-primary)]
    p-4
    text-[var(--color-primary-text)]
    shadow-lg
    transition-all duration-300
    hover:scale-110
    hover:shadow-[0_0_25px_rgba(192,253,185,0.45)]
    animate-bounce
  "
      >
        <ChevronDown className="h-5 w-5" />
      </button>
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <img
          src={ImageHero}
          alt=""
          aria-hidden="true"
          className="
            h-full w-full
            object-fit object-center
            select-none
          "
        />
      </div>

      {/* Overlay corporativo */}
      <div
        className="
          absolute inset-0
          bg-[var(--color-bg-secondary)]/5
        "
      />
    </section>
  );
};

export default Hero;
