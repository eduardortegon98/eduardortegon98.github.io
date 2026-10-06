import { Localized } from "../i18n/Language";
export default function FormStatus({ status }) {
  return status ? <Localized as="p" role={status.success ? "status" : "alert"} className={status.success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>{status.message}</Localized> : null;
}
export function Honeypot() {
  return <Localized as="div" hidden aria-hidden="true"><Localized as="label">Website<Localized as="input" name="website" tabIndex={-1} autoComplete="off" /></Localized></Localized>;
}
