import { cloneElement } from "react";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import "./Inquiry.css";

export function InquiryLayout({ sidebar, children }) {
  return <div className="inquiry-page"><Header /><main className="inquiry-shell"><aside className="inquiry-sidebar">{sidebar}<Link className="inquiry-home" to="/">Volver al inicio <ArrowUpRight size={14} /></Link></aside><div className="inquiry-main">{children}</div></main><footer className="inquiry-footer">Soluciones Tecnológicas Ortegón<span>Ingeniería con propósito.</span></footer></div>;
}
export function InquiryHeading({ eyebrow, title, children }) {
  return <div className="inquiry-heading"><p className="inquiry-eyebrow"><span />{eyebrow}</p><h1>{title}</h1><p className="inquiry-intro">{children}</p></div>;
}
export function InquirySection({ number, title, description, children }) {
  return <fieldset className="inquiry-group"><legend><span className="inquiry-number">{number}</span>{title}</legend>{description && <p className="inquiry-group-note">{description}</p>}<div className="inquiry-fields">{children}</div></fieldset>;
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
