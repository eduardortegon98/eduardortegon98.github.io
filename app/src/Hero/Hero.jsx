import Hyperspeed from "./Hyperspeed";
import { hyperspeedPresets } from "./hyperspeedPresets";
import { ChevronDown } from "lucide-react";
import Logo from "../../public/Soluciones_Tecnologicas_Ortegon.png";

const Hero = () => {
  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-[calc(100svh-64px)] w-full overflow-hidden bg-black">
      {/* Fondo */}
      <div className="absolute inset-0">
        <Hyperspeed effectOptions={hyperspeedPresets.four} />
      </div>

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/80" />

        <div className="absolute left-1/2 top-32 h-72 w-[18rem] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl md:h-[24rem] md:w-[24rem]" />
        <div className="absolute right-4 top-8 h-20 w-20 rounded-full bg-sky-400/15 blur-2xl md:right-10 md:top-10 md:h-28 md:w-28" />
        <div className="absolute bottom-24 left-4 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl md:left-10 md:h-52 md:w-52" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-64px)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="w-full max-w-4xl text-center">
          {/* Logo */}
          <img
            src={Logo}
            alt="Soluciones Tecnológicas Ortegón"
            className="mx-auto h-auto w-full max-w-[220px] object-contain sm:max-w-[280px] md:max-w-[340px] lg:max-w-[380px]"
          />

          {/* Título */}
          <h1 className="mt-4 font-extrabold leading-[1.08] tracking-tight text-[clamp(1.75rem,5.2vw,3.4rem)]">
            <span className="relative inline-block">
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-400/35 via-sky-400/30 to-blue-500/25 blur-3xl opacity-60" />
              <span className="text-[#C0FDB9]">Soluciones Tecnológicas</span>
            </span>

            <br />

            <span className="relative mt-2 inline-block">
              <span className="absolute left-0 right-0 -bottom-2 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent blur-[0.3px]" />
              <span className="text-white/95">
                impulsadas por <span className="text-[#C0FDB9]">IA</span> 
              </span>
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="mx-auto mt-5 max-w-2xl px-2 text-[clamp(1rem,2.5vw,1.15rem)] leading-relaxed text-white/75">
            Desarrollo web, automatización, sistemas inteligentes y herramientas digitales para empresas modernas.
          </p>

          {/* Botones */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              className="group relative w-full rounded-full bg-[#C0FDB9]/90 px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 sm:w-auto sm:text-base"
              onClick={() => goTo("products")}
              type="button"
            >
              <span className="absolute inset-0 rounded-full opacity-0 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition group-hover:opacity-100" />
              <span className="relative">Conócenos</span>
            </button>

            <button
              className="group relative w-full rounded-full border border-cyan-300/25 bg-black/30 px-6 py-3 text-sm font-semibold text-cyan-100 backdrop-blur transition hover:border-cyan-200/60 sm:w-auto sm:text-base"
              onClick={() => goTo("projects")}
              type="button"
            >
              <span className="absolute inset-0 rounded-full opacity-0 shadow-[0_0_30px_rgba(34,211,238,0.25)] transition group-hover:opacity-100" />
              <span className="relative">Proyectos</span>
            </button>
          </div>

          {/* Scroll hint */}
          <div className="mt-8 hidden items-center justify-center sm:flex">
            <button
              aria-label="Scroll down"
              type="button"
              onClick={() => goTo("stack")}
              className="group grid h-10 w-10 place-items-center rounded-full border border-cyan-300/25 bg-black/30 shadow-[0_0_22px_rgba(34,211,238,0.12)] backdrop-blur transition hover:border-cyan-200/60"
            >
              <ChevronDown className="h-5 w-5 text-cyan-100/90 transition group-hover:text-cyan-100" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
