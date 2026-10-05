import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = url && key ? createClient(url, key) : null;
export function requireSupabase() {
  if (!supabase) throw new Error("El servicio no está configurado. Por favor contáctanos por WhatsApp.");
  return supabase;
}

let recoveryPending = false;
if (supabase) supabase.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") recoveryPending = true;
  if (event === "SIGNED_OUT") recoveryPending = false;
});
export function isPasswordRecovery() { return recoveryPending; }
export function finishPasswordRecovery() { recoveryPending = false; }
