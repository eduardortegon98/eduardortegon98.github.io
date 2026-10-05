import { useRef, useState } from "react";
import { submitForm } from "../lib/submissions";
export default function useSubmission(kind, successMessage) {
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(null);
  async function submit(event) {
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    if (fields.website) return;
    delete fields.website;
    const payload = Object.fromEntries(Object.entries(fields).map(([key, value]) => ["p_" + key, String(value).trim()]));
    lock.current = true; setPending(true); setStatus(null);
    try {
      await submitForm(kind, payload);
      form.reset(); setStatus({ success: true, message: successMessage });
    } catch (error) {
      setStatus({ success: false, message: error.message });
    } finally { lock.current = false; setPending(false); }
  }
  return { submit, pending, status };
}
