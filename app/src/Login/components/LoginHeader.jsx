import { Localized } from "../../i18n/Language";
const copy = {
  login: ["Iniciar sesión", "Accede a tu cuenta de Soluciones Ortegón."],
  register: ["Crea tu cuenta", "Sigamos hablando de lo que tu negocio necesita."],
  recovery: ["Nueva contraseña", "Elige una contraseña segura para tu cuenta."],
  session: ["Tu cuenta", "Ya puedes continuar desde el inicio."],
};
export default function LoginHeader({ mode = "login" }) {
  const [title, description] = copy[mode] || copy.login;
  return <Localized as="div" className="text-center"><Localized as="h1" className="text-3xl font-extrabold sm:text-4xl">{title}</Localized><Localized as="p" className="mt-3 text-[var(--color-text-muted)]">{description}</Localized></Localized>;
}
