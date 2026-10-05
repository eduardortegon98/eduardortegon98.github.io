import { requireSupabase } from "./supabase";
export async function submitForm(kind, payload) {
  const client = requireSupabase();
  const { error } = await client.rpc("submit_" + kind, payload);
  if (error) throw new Error("No pudimos guardar la solicitud. Inténtalo nuevamente.");
}
