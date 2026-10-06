import { Children, cloneElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import "./Inquiry.css";

export function InquiryLayout({ sidebar, children }) {
  const main = useRef(null);
  useLayoutEffect(() => {
    const update = () => {
      const top = main.current.getBoundingClientRect().top + window.scrollY;
      main.current.style.setProperty("--inquiry-available-height", `${Math.max(180, window.innerHeight - top - 16)}px`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(main.current.parentElement);
    observer.observe(main.current.parentElement.querySelector(".inquiry-heading"));
    window.addEventListener("resize", update); update();
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, []);
  return <div className="inquiry-page"><Header /><main className="inquiry-shell"><aside className="inquiry-sidebar">{sidebar}<Link className="inquiry-home" to="/">Volver al inicio <ArrowUpRight size={14} /></Link></aside><div ref={main} className="inquiry-main">{children}</div></main><footer className="inquiry-footer">Soluciones Tecnológicas Ortegón<span>Ingeniería con propósito.</span></footer></div>;
}
export function InquiryHeading({ eyebrow, title, children }) {
  return <div className="inquiry-heading"><p className="inquiry-eyebrow"><span />{eyebrow}</p><h1>{title}</h1><p className="inquiry-intro">{children}</p></div>;
}
export function InquirySection({ number, title, description, children, hidden = false }) {
  return <fieldset className="inquiry-group" hidden={hidden}><legend tabIndex={-1}><span className="inquiry-number">{number}</span>{title}</legend>{description && <p className="inquiry-group-note">{description}</p>}<div className="inquiry-fields">{children}</div></fieldset>;
}
export function InquiryField({ id, label, optional = false, hint, wide = false, children }) {
  return <div className={`inquiry-field ${wide ? "inquiry-field--wide" : ""}`}><label htmlFor={id}>{label}{optional && <span>Opcional</span>}</label>{hint ? cloneElement(children, { "aria-describedby": `${id}-hint` }) : children}{hint && <p id={`${id}-hint`} className="inquiry-hint">{hint}</p>}</div>;
}
export function InquirySelect({ id, name, options, placeholder }) {
  return <div className="inquiry-select"><select id={id} name={name} required defaultValue=""><option value="" disabled>{placeholder}</option>{options.map(value => <option key={value} value={value}>{value}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div>;
}
export function InquiryNote({ children }) {
  return <p className="inquiry-note"><Check size={15} aria-hidden="true" />{children}</p>;
}

export function InquiryStepForm({ pending, submit, status, children, submitLabel, pendingLabel, note, honeypot }) {
  const [compact, setCompact] = useState(false);
  const [step, setStep] = useState(0);
  const form = useRef(null);
  const groups = Children.toArray(children);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px), (max-height: 740px)");
    const update = () => { setCompact(query.matches); setStep(0); };
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => { if (status?.success) setStep(0); }, [status]);
  useEffect(() => {
    if (!compact) return;
    const group = form.current.querySelectorAll(".inquiry-group")[step];
    group?.querySelector("legend")?.focus({ preventScroll: true });
    if (group) group.parentElement.scrollTop = 0;
  }, [step, compact]);
  function next() {
    const group = form.current.querySelectorAll(".inquiry-group")[step];
    for (const field of group.querySelectorAll("input, select, textarea")) {
      if (!field.reportValidity()) return;
    }
    setStep(value => value + 1);
  }
  function onSubmit(event) {
    if (compact && step < groups.length - 1) { event.preventDefault(); next(); return; }
    submit(event);
  }
  // Validate only the visible step on narrow/short screens; the submit hook validates all fields before sending.
  return <form ref={form} className={`inquiry-form ${compact ? "inquiry-form--stepped" : ""}`} onSubmit={onSubmit} noValidate={compact} aria-busy={pending}>
    {honeypot}
    {compact && <div className="inquiry-step-progress" aria-live="polite"><strong>Paso {step + 1} de {groups.length}</strong><div aria-hidden="true">{groups.map((_, index) => <i key={index} className={index <= step ? "is-active" : ""} />)}</div></div>}
    <fieldset disabled={pending} className="inquiry-form-fields">{groups.map((group, index) => cloneElement(group, { hidden: compact && index !== step }))}</fieldset>
    <div className="inquiry-form-bottom">
      <div className="inquiry-form-actions">{compact && step > 0 && <button type="button" className="inquiry-back" disabled={pending} onClick={() => setStep(value => value - 1)}>Atrás</button>}
      {compact && step < groups.length - 1 ? <button type="button" className="inquiry-submit" onClick={next} disabled={pending}>Continuar <ArrowUpRight size={17} /></button> : <button type="submit" disabled={pending} className="inquiry-submit">{pending ? pendingLabel : submitLabel}<ArrowUpRight size={17} /></button>}</div>
      <InquiryNote>{note}</InquiryNote>
      {status && <div className="inquiry-status" role={status.success ? "status" : "alert"}>{status.message}</div>}
    </div>
  </form>;
}
