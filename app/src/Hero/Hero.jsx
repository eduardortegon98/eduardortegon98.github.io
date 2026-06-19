import { ChevronDown, Cpu } from "lucide-react";
import { animate } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import ImageHero from "../assets/zeus_milo_lulu.webp";

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
        relative h-[calc(98svh-64px)] w-full overflow-hidden
        bg-[var(--color-bg-secondary)] grid grid-cols-1 md:grid-cols-2
        items-center isolation-isolate
      "
    >
      {/* BLOQUE IZQUIERDO: Contenido y Propuesta de Valor (50% exacto) */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 py-12 z-10 selection:bg-[var(--color-primary)] selection:text-black">
        {/* Título Principal con corrección de contraste para fondo claro/oscuro */}
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black mb-6 tracking-tight leading-[1.1] text-neutral-900 dark:text-white">
          Soluciones de Ingenieria, <br />
          <span className="text-[var(--color-primary)] bg-clip-text">
            Diseñadas con IA
          </span>
        </h1>

        {/* Descripción adaptable */}
        <p className="text-base sm:text-lg text-neutral-600 dark:text-gray-400 font-normal leading-relaxed max-w-md mb-8">
          Menos tareas manuales, más productividad. Con la{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">
            fidelidad y el compromiso de un aliado tecnológico
          </span>
          , automatizamos tus procesos, te acompañamos durante todo tu proyecto
          y te ayudamos a lograr tus objetivos de crecimiento.
        </p>

        {/* Botones de acción principales */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => goTo("products")}
            className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-text)] font-semibold text-sm tracking-wide shadow-lg shadow-[var(--color-primary)]/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explorar Soluciones
          </button>
        </div>
      </div>

      {/* BLOQUE DERECHO: Imagen de las Mascotas al 50% exacto */}
      <div className="relative h-[50vh] md:h-full w-full flex items-center justify-center overflow-hidden bg-neutral-950/5 dark:bg-black/20">
        <img
          src={ImageHero}
          alt="Mascotas biónicas de Ortegón Soluciones Tecnológicas"
          className="
            h-full w-full
            object-cover
            object-center
            select-none
          "
        />

        {/* Gradiente de atenuación inferior para suavizar el cambio de sección */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-bg-secondary)] to-transparent z-10" />
      </div>

      {/* Indicador de scroll inferior central */}
      <div className="absolute bottom-6 left-1/4 -translate-x-1/2 z-20 hidden md:block">
        <button
          type="button"
          onClick={() => goTo("products")}
          aria-label="Ir a la sección de productos"
          className="
            flex items-center justify-center
            rounded-full bg-neutral-200/50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 backdrop-blur-md p-3.5
            text-neutral-600 dark:text-gray-400 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30
            shadow-xl transition-all duration-300 hover:scale-110
            animate-bounce
          "
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
