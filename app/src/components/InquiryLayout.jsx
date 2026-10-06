import { Localized } from "../i18n/Language";
import { Children, cloneElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import "./Inquiry.css";

export function InquiryLayout({ sidebar, children }) {
  const main = useRef(null);
  useLayoutEffect(() => {
    const update = () => {
      const narrow = window.matchMedia("(max-width: 760px)").matches;
      const top = narrow ? main.current.getBoundingClientRect().top + window.scrollY : main.current.parentElement.getBoundingClientRect().top + window.scrollY + parseFloat(getComputedStyle(main.current.parentElement).paddingTop);
      main.current.parentElement.style.setProperty("--inquiry-available-height", `max(180px, calc(100dvh - ${top + 16}px))`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(main.current.parentElement);
    observer.observe(main.current.parentElement.querySelector(".inquiry-heading"));
    window.addEventListener("resize", update); update();
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, []);
  return <Localized as="div" className="inquiry-page"><Header /><Localized as="main" className="inquiry-shell"><Localized as="aside" className="inquiry-sidebar">{sidebar}<Localized as={Link} className="inquiry-home" to="/">Volver al inicio <ArrowUpRight size={14} /></Localized></Localized><Localized as="div" ref={main} className="inquiry-main">{children}</Localized></Localized><Localized as="footer" className="inquiry-footer">Soluciones Tecnológicas Ortegón<Localized as="span">Ingeniería con propósito.</Localized></Localized></Localized>;
}
export function InquiryHeading({ eyebrow, title, children }) {
  return <Localized as="div" className="inquiry-heading"><Localized as="p" className="inquiry-eyebrow"><Localized as="span" />{eyebrow}</Localized><Localized as="h1">{title}</Localized><Localized as="p" className="inquiry-intro">{children}</Localized></Localized>;
}
export function InquirySection({ number, title, description, children, hidden = false }) {
  return <Localized as="fieldset" className="inquiry-group" hidden={hidden}><Localized as="legend" tabIndex={-1}><Localized as="span" className="inquiry-number">{number}</Localized>{title}</Localized>{description && <Localized as="p" className="inquiry-group-note">{description}</Localized>}<Localized as="div" className="inquiry-fields">{children}</Localized></Localized>;
}
export function InquiryField({ id, label, optional = false, hint, wide = false, children }) {
  return <Localized as="div" className={`inquiry-field ${wide ? "inquiry-field--wide" : ""}`}><Localized as="label" htmlFor={id}>{label}{optional && <Localized as="span">Opcional</Localized>}</Localized>{hint ? cloneElement(children, { "aria-describedby": `${id}-hint` }) : children}{hint && <Localized as="p" id={`${id}-hint`} className="inquiry-hint">{hint}</Localized>}</Localized>;
}
export function InquirySelect({ id, name, options, placeholder }) {
  return <Localized as="div" className="inquiry-select"><Localized as="select" id={id} name={name} required defaultValue=""><Localized as="option" value="" disabled>{placeholder}</Localized>{options.map(value => <Localized as="option" key={value} value={value}>{value}</Localized>)}</Localized><ChevronDown size={16} aria-hidden="true" /></Localized>;
}
export function InquiryNote({ children }) {
  return <Localized as="p" className="inquiry-note"><Check size={15} aria-hidden="true" />{children}</Localized>;
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
  return <Localized as="form" ref={form} className={`inquiry-form ${compact ? "inquiry-form--stepped" : ""}`} onSubmit={onSubmit} noValidate={compact} aria-busy={pending}>
    {honeypot}
    {compact && <Localized as="div" className="inquiry-step-progress" aria-live="polite"><Localized as="strong">Paso {step + 1} de {groups.length}</Localized><Localized as="div" aria-hidden="true">{groups.map((_, index) => <Localized as="i" key={index} className={index <= step ? "is-active" : ""} />)}</Localized></Localized>}
    <Localized as="fieldset" disabled={pending} className="inquiry-form-fields">{groups.map((group, index) => cloneElement(group, { hidden: compact && index !== step }))}</Localized>
    <Localized as="div" className="inquiry-form-bottom">
      <Localized as="div" className="inquiry-form-actions">{compact && step > 0 && <Localized as="button" type="button" className="inquiry-back" disabled={pending} onClick={() => setStep(value => value - 1)}>Atrás</Localized>}
      {compact && step < groups.length - 1 ? <Localized as="button" type="button" className="inquiry-submit" onClick={next} disabled={pending}>Continuar <ArrowUpRight size={17} /></Localized> : <Localized as="button" type="submit" disabled={pending} className="inquiry-submit">{pending ? pendingLabel : submitLabel}<ArrowUpRight size={17} /></Localized>}</Localized>
      <InquiryNote>{note}</InquiryNote>
      {status && <Localized as="div" className="inquiry-status" role={status.success ? "status" : "alert"}>{status.message}</Localized>}
    </Localized>
  </Localized>;
}
