import { ChevronDown } from "lucide-react";
import Logo from "../../public/Soluciones_Tecnologicas_Ortegon.png";

import { useTheme } from "../context/ThemeContext";
import ImageHero from "../assets/zeus_milo.png";

const Hero = () => {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const goTo = (id) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
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

      {/* Contenido */}
      <div
        className="
    relative z-10
    flex min-h-[calc(100svh-64px)]
    w-full
    items-start justify-center
    px-1 pt-16 pb-10
    sm:px-1 sm:pt-20 sm:pb-12
    lg:px-1 lg:pt-5
  "
      >
        <div className="w-full max-w-4xl ml-40">
          <h1
            className="
        font-extrabold
        leading-[1.08]
        tracking-tight
        text-[clamp(1.75rem,5.2vw,3.4rem)]
        text-[var(--color-primary)]
      "
          >
            Soluciones Tecnológicas Ortegón
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
