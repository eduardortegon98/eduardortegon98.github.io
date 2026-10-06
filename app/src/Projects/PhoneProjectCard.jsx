import { Localized } from "../i18n/Language";
import React, { memo, useMemo, useState, useCallback } from "react";
import { ExternalLink, Github, BookOpen, Search } from "lucide-react";

/** Mapa de documentación */
const DOCS = {
  React: "https://react.dev/",
  Tailwind: "https://tailwindcss.com/docs",
  Vite: "https://vitejs.dev/guide/",
  "Node.js": "https://nodejs.org/en/docs",
  Node: "https://nodejs.org/en/docs",
  Firebase: "https://firebase.google.com/docs",
  TypeScript: "https://www.typescriptlang.org/docs/",
  JavaScript: "https://developer.mozilla.org/docs/Web/JavaScript",
};

const PHONE_W = 340;
const PHONE_H = 660;
const MAX_KEYS = 12;
const EMPTY_KEY = "—";

function resolveDocLink(label) {
  if (!label) return null;
  if (DOCS[label]) return DOCS[label];

  const normalized = label.trim().toLowerCase();
  const entry = Object.entries(DOCS).find(([k]) => k.toLowerCase() === normalized);

  if (entry) return entry[1];

  return `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(label)}`;
}

function isOfficialDoc(label) {
  if (!label) return false;
  if (DOCS[label]) return true;

  const normalized = label.trim().toLowerCase();
  return Object.keys(DOCS).some((k) => k.toLowerCase() === normalized);
}

const KeyButton = memo(function KeyButton({
  item,
  isSelected,
  onSelect,
}) {
  const { label, isReal, link, official } = item;

  const className = [
    "relative rounded-xl border px-3 py-3 text-[11px] font-extrabold tracking-wide transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
    isSelected
      ? "border-[var(--color-accent)] bg-[var(--color-primary-soft)]"
      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface)]",
    !isReal ? "opacity-30 cursor-not-allowed text-[var(--color-text-muted)]" : "text-[var(--color-text-muted)]",
  ].join(" ");

  if (!isReal) {
    return (
      <Localized as="button"
        type="button"
        disabled
        className={className}
        aria-label="Empty key"
        title="Empty"
      >
        <Localized as="span" className="block text-center leading-tight">{label}</Localized>
        <Localized as="span" className="mt-1 block text-center text-[9px] font-black tracking-widest text-[var(--color-text-muted)]">
          —
        </Localized>
      </Localized>
    );
  }

  return (
    <Localized as="button"
      type="button"
      onClick={() => onSelect(item)}
      className={className}
      title={`Abrir ${official ? "docs oficiales" : "búsqueda"} de ${label}`}
      aria-label={`Seleccionar documentación de ${label}`}
    >
      <Localized as="span" className="block text-center leading-tight">{label}</Localized>
      <Localized as="span" className="mt-1 block text-center text-[9px] font-black tracking-widest text-[var(--color-text-muted)]">
        {official ? "OFFICIAL" : "SEARCH"}
      </Localized>
    </Localized>
  );
});

const PhoneProjectCard = memo(function PhoneProjectCard({ p }) {
  const [selectedKey, setSelectedKey] = useState(null);

  const keys = useMemo(() => {
    const base = (p.tags || []).slice(0, MAX_KEYS);
    const filled = [...base];

    while (filled.length < MAX_KEYS) {
      filled.push(EMPTY_KEY);
    }

    return filled.map((label, idx) => {
      const isReal = idx < base.length && label !== EMPTY_KEY;
      return {
        id: `${p.title}-${idx}-${label}`,
        label,
        isReal,
        link: isReal ? resolveDocLink(label) : null,
        official: isReal ? isOfficialDoc(label) : false,
      };
    });
  }, [p.tags, p.title]);

  const selectedItem = useMemo(() => {
    if (!selectedKey) return null;
    return keys.find((item) => item.id === selectedKey) || null;
  }, [keys, selectedKey]);

  const onSelect = useCallback((item) => {
    setSelectedKey(item.id);
  }, []);

  return (
    <Localized as="article" className="relative mx-auto select-none" style={{ width: PHONE_W, height: PHONE_H }}>
      <Localized as="div" className="absolute inset-4 -z-10 rounded-[2.5rem] bg-[var(--color-bg-secondary)] blur-xl" />

      <Localized as="div"
        className="
          relative h-full w-full rounded-[2.5rem] p-[10px]
          border border-[var(--color-border)]
          bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface)] to-[var(--color-surface)]
          shadow-[0_14px_40px_rgba(32,58,43,0.08)]
        "
      >
        <Localized as="div" className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)]">
          <Localized as="div" className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2">
            <Localized as="div" className="h-1.5 w-20 rounded-full bg-[var(--color-bg-secondary)]" />
          </Localized>

          <Localized as="div" className="relative flex-1 overflow-hidden px-5 pb-4 pt-10">
            <Localized as="div" className="pointer-events-none absolute inset-0">
              <Localized as="div" className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-[var(--color-primary-soft)] blur-xl" />
              <Localized as="div" className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-[var(--color-primary-soft)] blur-xl" />
            </Localized>

            <Localized as="div" className="relative">
              <Localized as="div" className="flex items-start justify-between gap-3">
                <Localized as="div" className="min-w-0">
                  <Localized as="div" className="flex items-center gap-2">
                    <Localized as="h3" className="truncate text-[var(--color-text)] font-extrabold tracking-tight">
                      {p.title}
                    </Localized>

                    {p.status ? (
                      <Localized as="span" className="shrink-0 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-black tracking-widest text-[var(--color-text)]">
                        {p.status.toUpperCase()}
                      </Localized>
                    ) : null}
                  </Localized>

                  <Localized as="p" className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
                    {p.description}
                  </Localized>
                </Localized>

                <Localized as="div" className="flex shrink-0 items-center gap-2">
                  {p.github ? (
                    <Localized as="a"
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="grid size-9 place-items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)]"
                    >
                      <Github className="size-4" />
                    </Localized>
                  ) : null}

                  {p.href ? (
                    <Localized as="a"
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open project"
                      className="grid size-9 place-items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)]"
                    >
                      <ExternalLink className="size-4" />
                    </Localized>
                  ) : null}
                </Localized>
              </Localized>

              <Localized as="div" className="mt-4 h-px w-full bg-[var(--color-surface)]" />

              <Localized as="div" className="mt-3">
                {selectedItem ? (
                  <Localized as="div" className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                    <Localized as="div" className="min-w-0">
                      <Localized as="div" className="flex items-center gap-2">
                        <Localized as="span" className="text-[11px] font-black tracking-widest text-[var(--color-text-muted)]">
                          SELECTED
                        </Localized>

                        <Localized as="span"
                          className={[
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black tracking-widest",
                            selectedItem.official
                              ? "bg-[var(--color-primary)] text-[var(--color-text)]"
                              : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]",
                          ].join(" ")}
                        >
                          {selectedItem.official ? (
                            <>
                              <BookOpen className="size-3" />
                              OFFICIAL
                            </>
                          ) : (
                            <>
                              <Search className="size-3" />
                              SEARCH
                            </>
                          )}
                        </Localized>
                      </Localized>

                      <Localized as="div" className="mt-1 truncate text-[13px] font-extrabold text-[var(--color-text)]">
                        {selectedItem.label}
                      </Localized>

                      <Localized as="div" className="mt-1 truncate text-[11px] text-[var(--color-text-muted)]">
                        {selectedItem.link}
                      </Localized>
                    </Localized>

                    <Localized as="a"
                      href={selectedItem.link}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        shrink-0 rounded-lg border border-[var(--color-accent)] bg-[var(--color-primary-soft)]
                        px-3 py-2 text-[11px] font-black text-[var(--color-text)] transition-colors
                        hover:bg-[var(--color-primary-soft)]
                      "
                      aria-label="Open selected documentation"
                    >
                      Open docs →
                    </Localized>
                  </Localized>
                ) : (
                  <Localized as="div" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                    <Localized as="div" className="text-[11px] font-black tracking-widest text-[var(--color-text-muted)]">
                      TIP
                    </Localized>
                    <Localized as="div" className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                      Toca una tech abajo para ver y abrir su documentación.
                    </Localized>
                  </Localized>
                )}
              </Localized>
            </Localized>
          </Localized>

          <Localized as="div" className="shrink-0 border-t border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface)] p-5 pt-4">
            <Localized as="div" className="grid grid-cols-3 gap-3">
              {keys.map((item) => (
                <KeyButton
                  key={item.id}
                  item={item}
                  isSelected={selectedKey === item.id && item.isReal}
                  onSelect={onSelect}
                />
              ))}
            </Localized>

            <Localized as="div" className="mt-4 flex justify-center">
              <Localized as="div" className="h-1.5 w-16 rounded-full bg-[var(--color-bg-secondary)]" />
            </Localized>
          </Localized>
        </Localized>
      </Localized>
    </Localized>
  );
});

export default PhoneProjectCard;