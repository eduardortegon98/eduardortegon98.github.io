export default function FormStatus({ status }) {
  return status ? <p role={status.success ? "status" : "alert"} className={status.success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>{status.message}</p> : null;
}
export function Honeypot() {
  return <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>;
}
