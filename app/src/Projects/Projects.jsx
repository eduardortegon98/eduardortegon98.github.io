import React from "react";
import PhoneProjectCard from "./PhoneProjectCard";

const PROJECTS = [
  {
    title: "Blurealty.AI",
    description: "El primer sitio web inmobiliario impulsado por IA",
    tags: ["React", "Tailwind", "Vite", "Zoho", "Firebase", "AI"],
    href: "https://blurealty.ai/",
    status: "Beta",
    // github: "https://github.com/...",
  },
  {
    title: "5IG Solutions",
    description: "Landing Page para una empresa de soluciones tecnológicas.",
    tags: ["React", "Node.js", "Tailwind", "CSS", "Azure"],
    href: "https://5igsolutions.com/",
    status: "Done",
  },
  {
    title: "Mariagua Group",
    description: "Desarrollo de marca y creación de sitio web.",
    tags: ["React", "Node", "Tailwind", "Firebase"],
    href: "https://adiston.com/",
    status: "Beta",
  },
];

const Background = () => (
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -top-28 left-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
    <div className="absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
    <div className="absolute inset-0 bg-[#474B4E]" />
  </div>
);

const SectionHeader = () => (
  <div className="text-center">
    <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#C0FDB9]">
      Nuevos Proyectos
    </h2>
    <p className="mx-auto mt-3 max-w-2xl text-white/65">
      Para ingresar a los proyectos haz click en el icono superior derecho de
      cada celular.{" "}
    </p>
  </div>
);

const ProjectsGrid = ({ projects }) => (
  <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
    {projects.map((p) => (
      <PhoneProjectCard key={p.title} p={p} />
    ))}
  </div>
);

const Projects = () => {
  return (
    <section
      id="projects"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white"
    >
      <Background />

      <div className="relative w-full max-w-7xl px-6 py-16">
        <SectionHeader />
        <ProjectsGrid projects={PROJECTS} />
      </div>
    </section>
  );
};

export default Projects;
