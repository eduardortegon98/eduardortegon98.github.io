import { pathToFileURL } from "node:url";

export function validatePagesConfig(env) {
  const url = env.VITE_SUPABASE_URL?.trim();
  const key = env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) throw new Error("Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Settings > Secrets and variables > Actions antes de publicar.");
  let parsed;
  try { parsed = new URL(url); } catch { throw new Error("VITE_SUPABASE_URL debe ser una URL HTTPS válida."); }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.search || parsed.hash || (parsed.pathname !== "/" && parsed.pathname !== "")) {
    throw new Error("VITE_SUPABASE_URL debe ser el origen HTTPS del proyecto.");
  }
  if (key.startsWith("sb_publishable_") && key.length > 20) return;
  if (key.startsWith("sb_secret_")) throw new Error("Nunca publiques claves secretas de Supabase en VITE_SUPABASE_ANON_KEY.");
  let payload;
  try {
    const parts = key.split(".");
    if (parts.length !== 3) throw new Error();
    payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
  } catch { throw new Error("VITE_SUPABASE_ANON_KEY debe ser una clave pública publishable o anon."); }
  if (payload.role !== "anon") throw new Error("La clave JWT debe tener rol anon. No publiques service_role.");
  if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) throw new Error("La clave pública de Supabase ha expirado.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    validatePagesConfig(process.env);
    console.log("Configuración pública de Supabase verificada.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
