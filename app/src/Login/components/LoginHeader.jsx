const copy = {
  login: ["Iniciar sesión", "Accede a tu cuenta de Soluciones Ortegón."],
  register: ["Crea tu cuenta", "Sigamos hablando de lo que tu negocio necesita."],
  recovery: ["Nueva contraseña", "Elige una contraseña segura para tu cuenta."],
  session: ["Tu cuenta", "Ya puedes continuar desde el inicio."],
};
export default function LoginHeader({ mode = "login" }) {
  const [title, description] = copy[mode] || copy.login;
  return <div className="text-center"><h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1><p className="mt-3 text-[var(--color-text-muted)]">{description}</p></div>;
}
