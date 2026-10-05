import crmBot from "../assets/crm_bot.png";
import webBot from "../assets/web_bot.png";
import ortdeskBot from "../assets/ortdesk-bot.png";

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
      "Centraliza contactos y el seguimiento comercial.",
    image: crmBot,
    features: [
      { label: "Gestión clientes", Icon: Users },
      { label: "Embudo de ventas", Icon: GitMerge },
      { label: "Reportes y métricas", Icon: BarChart3 },
    ],
  },

  {
    key: "ortweb",
    eyebrow: "ORTWEB",
    title: "Sitios web que impulsan tu negocio",
    description:
      "Diseñamos páginas rápidas y adaptadas a todos los dispositivos.",
    image: webBot,
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
    image: ortdeskBot,
    features: [
      { label: "Atención 24/7", Icon: MessageCircle },
      { label: "Respuestas automáticas", Icon: ShieldCheck },
      { label: "Captura leads", Icon: Users },
    ],
  },
];
