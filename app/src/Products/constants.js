import {
  MessageCircle,
  Globe,
  Users,
  GitMerge,
  LifeBuoy,
  Package,
  Activity,
  Radio,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export const PRODUCTS = [
  {
    key: "ortcrm",
    eyebrow: "ORTCRM",
    title: "Gestiona tus clientes y ventas en un solo lugar",
    description:
      "Organiza contactos, oportunidades y el seguimiento de tu equipo comercial.",
    image: "./src/assets/crm_bot.png",
    features: [
      { label: "Gestión de clientes", Icon: Users },
      { label: "Embudo de ventas", Icon: GitMerge },
      { label: "Reportes y métricas", Icon: BarChart3 },
    ],
  },

  {
    key: "ortweb",
    eyebrow: "ORTWEB",
    title: "Sitios web que impulsan tu negocio",
    description:
      "Diseñamos páginas modernas, rápidas y adaptadas a todos los dispositivos.",
    image: "./src/assets/web_bot.png",
    features: [
      { label: "Diseño responsive", Icon: Globe },
      { label: "Rápido y seguro", Icon: ShieldCheck },
      { label: "Optimizado SEO", Icon: BarChart3 },
    ],
  },
  {
    key: "ortdesk",
    eyebrow: "ORTDESK AI",
    title: "Asistente inteligente para WhatsApp y Web",
    description:
      "Atiende, responde y convierte 24/7 con Inteligencia Artificial.",
    image: "./src/assets/ortdesk-bot.png", // Asegúrate de tener las rutas correctas
    features: [
      { label: "Atención 24/7", Icon: MessageCircle },
      { label: "Respuestas automáticas", Icon: ShieldCheck },
      { label: "Captura leads", Icon: Users },
    ],
  },
];
