import { SiReact, SiNodedotjs, SiTailwindcss, SiVite, SiN8N, SiSupabase, SiFirebase, SiZoho, SiOpenai, SiPython, SiWhatsapp, SiDocker } from 'react-icons/si';
import { VscAzure } from 'react-icons/vsc';
const icons = { React: SiReact, 'Node.js': SiNodedotjs, Tailwind: SiTailwindcss, Vite: SiVite, n8n: SiN8N, Supabase: SiSupabase, Firebase: SiFirebase, Zoho: SiZoho, OpenAI: SiOpenai, Python: SiPython, WhatsApp: SiWhatsapp, Docker: SiDocker, Azure: VscAzure };
export default function TechnologyIcon({ name }) {
  const Icon = icons[name];
  return Icon ? <Icon aria-hidden="true" focusable="false" className="technology-brand-icon" /> : null;
}
