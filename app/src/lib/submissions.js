import { requireSupabase } from "./supabase";

export function databaseErrorMessage(error, fallback) {
  if (error?.code === "PGRST202" || error?.code === "PGRST205") {
    return "El servicio de formularios aún no está habilitado. Contáctanos por WhatsApp mientras lo solucionamos.";
  }
  return fallback;
}

export async function submitForm(kind, payload) {
  const client = requireSupabase();
  const { error } = await client.rpc("submit_" + kind, payload);
  if (error) {
    // Log only the endpoint and error code; never visitors' personal data.
    console.error("Form submission failed", { endpoint: "submit_" + kind, code: error.code });
    throw new Error(databaseErrorMessage(error, "No pudimos guardar la solicitud. Inténtalo nuevamente."));
  }
}
