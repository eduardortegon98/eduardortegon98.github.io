import "./ChatAppearance.css";
import robotAvatar from "../assets/ortegon-robot-hero.webp";
import { Localized, useLanguage, translate } from "../i18n/Language";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, TrashIcon, Sparkles } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPaperPlane,
} from "react-icons/fa";

const CONTACTS = {
  whatsappNumber: "573337255586",
  facebookPage: "TU_PAGE_ID_O_USERNAME",
  instagramUsername: "tu_usuario",
};

const CHANNELS = [
  { id: "whatsapp", Icon: FaWhatsapp, title: "WhatsApp" },
  // { id: "facebook", Icon: FaFacebookF, title: "Facebook" },
  // { id: "instagram", Icon: FaInstagram, title: "Instagram" },
];

const cx = (...arr) => arr.filter(Boolean).join(" ");

const pickSuggestion = (text, channel) => {
  const t = (text || "").toLowerCase().trim();
  if (!t) {
    return {
      label: "Sugerencia: “Hola, quiero una cotización para…”",
      fill: "Hola, quiero una cotización para ",
    };
  }

  const has = (...words) => words.some((w) => t.includes(w));

  if (has("precio", "cuánto", "cuanto", "valor", "cotiz", "presupuesto")) {
    return {
      label: "Siguiente: agrega qué servicio y tu ubicación.",
      fill: "¿Me puedes cotizar el servicio de  ? Estoy en  y mi disponibilidad es  .",
    };
  }

  if (
    has(
      "pc",
      "comput",
      "portátil",
      "portatil",
      "laptop",
      "windows",
      "formate",
      "lento",
      "virus",
    )
  ) {
    return {
      label: "Siguiente: describe el problema + marca/modelo.",
      fill: "Mi equipo (marca/modelo: ) presenta: . ¿Me ayudas con diagnóstico y costo?",
    };
  }

  if (has("cámara", "camara", "cctv", "seguridad", "dvr", "nvr")) {
    return {
      label: "Siguiente: cuántas cámaras y si es para casa/negocio.",
      fill: "Quiero instalar CCTV:  cámaras para (casa/negocio). ¿Qué incluye y precio aproximado?",
    };
  }

  if (has("internet", "wifi", "red", "router", "switch", "cableado", "fibra")) {
    return {
      label: "Siguiente: tamaño del lugar y cuántos dispositivos.",
      fill: "Necesito mejorar mi red/WiFi. El lugar mide aprox  m² y hay  dispositivos. ¿Qué recomiendas?",
    };
  }

  if (has("impresora", "printer", "tinta", "cartucho")) {
    return {
      label: "Siguiente: marca/modelo y qué error sale.",
      fill: "Mi impresora (marca/modelo: ) muestra el error: . ¿Tienen soporte y costo?",
    };
  }

  if (channel === "instagram") {
    return {
      label: "Sugerencia: pregunta directo y corto (IG).",
      fill: "Hola 👋 ¿Me ayudas con ? Necesito info y precios.",
    };
  }

  return {
    label: "Sugerencia: agrega detalles clave (qué, dónde, cuándo).",
    fill: "Hola, necesito ayuda con . Estoy en  y me gustaría agendar para  .",
  };
};

const modalVariants = {
  initial: {
    opacity: 0,
    y: 34,
    scale: 0.86,
    rotate: -6,
    filter: "blur(10px)",
    clipPath: "polygon(104% -10%, 104% -10%, -10% 104%, -10% 104%)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 36,
    scale: 0.88,
    rotate: 6,
    filter: "blur(10px)",
    clipPath: "polygon(-10% -10%, 110% -10%, 110% -10%, -10% -10%)",
    transition: { duration: 0.55, ease: [0.7, 0, 0.84, 0] },
  },
};

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

function ChannelPill({ id, Icon, title, active, onSelect }) {
  return (
    <Localized as="button"
      onClick={() => onSelect(id)}
      type="button"
      aria-label={title}
      title={title}
      className={cx(
        "group relative overflow-hidden inline-flex items-center justify-center",
        "h-11 w-14 rounded-2xl ring-1 transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/60",
        active
          ? "bg-[var(--color-primary)]/90 text-[var(--color-text)] ring-[var(--color-border)]"
          : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] ring-[var(--color-border)]",
      )}
    >
      <Localized as="span"
        className={cx(
          "pointer-events-none absolute -inset-10 blur-2xl transition",
          active
            ? "bg-[var(--color-primary)]/22 opacity-100"
            : "bg-[var(--color-primary)]/16 opacity-0 group-hover:opacity-100",
        )}
      />
      <Icon className="relative text-[18px]" />
    </Localized>
  );
}

function IconAction({ onClick, title, children, variant = "ghost" }) {
  return (
    <Localized as="button"
      onClick={onClick}
      type="button"
      aria-label={title}
      title={title}
      className={cx(
        "group relative overflow-hidden inline-flex items-center justify-center",
        "h-11 w-11 sm:h-12 sm:w-12 rounded-2xl ring-1 transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/60",
        variant === "primary"
          ? "bg-[var(--color-primary)]/90 hover:bg-[var(--color-primary)] text-[var(--color-text)] ring-[var(--color-border)] shadow-[0_18px_55px_-35px_rgba(192,253,185,0.95)]"
          : "bg-[var(--color-surface)] hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] ring-[var(--color-border)] hover:ring-[var(--color-accent)]/25",
      )}
    >
      {variant === "primary" && (
        <>
          <Localized as="span" className="pointer-events-none absolute -inset-10 bg-[var(--color-primary)]/25 blur-2xl opacity-0 group-hover:opacity-100 transition" />
          <Localized as="span" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/40 via-white/10 to-transparent opacity-55 group-hover:opacity-75 transition" />
        </>
      )}
      <Localized as="span" className="relative">{children}</Localized>
    </Localized>
  );
}

function WalkieModal({
  open,
  onClose,
  channel,
  setChannel,
  message,
  setMessage,
  suggestion,
  applySuggestion,
  whatsappHref,
  clear,
}) {
  return (
    <AnimatePresence>
      {open && (
        <Localized as={motion.div}
          className="fixed inset-0 z-[60]"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Localized as={motion.button}
            className="absolute inset-0 bg-[var(--color-text)]/10"
            onClick={onClose}
            aria-label="Cerrar modal"
            type="button"
            variants={overlayVariants}
          />

          {/* MOBILE: centrado vertical
              DESKTOP: abajo derecha */}
          <Localized as="div"
            className="
              absolute inset-x-4 top-1/2 -translate-y-1/2
              sm:left-auto sm:right-6 sm:top-auto sm:bottom-6 sm:translate-y-0 sm:inset-x-auto
            "
          >
            <Localized as="div" className="mx-auto w-full max-w-[560px] sm:mx-0 sm:w-[92vw] sm:max-w-md">
              <Localized as={motion.div}
                variants={modalVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={cx(
                  "ortegon-chat-panel relative overflow-hidden rounded-3xl",
                  "bg-[var(--color-surface)] backdrop-blur-xl ring-1 ring-[var(--color-border)]",
                  "shadow-[0_20px_60px_rgba(32,58,43,0.15)]",
                  "max-h-[calc(100svh-2rem)] sm:max-h-[calc(100svh-3rem)] flex flex-col",
                )}
              >
                <Localized as={motion.div}
                  className="pointer-events-none absolute -inset-40"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(192,253,185,0.30), transparent 55%, rgba(255,255,255,0.08))",
                  }}
                  initial={{ opacity: 0, rotate: -10, scale: 1.04 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />

                <Localized as="div" className="pointer-events-none absolute -top-10 left-0 right-0 h-24 bg-[var(--color-primary)]/20 blur-3xl" />

                <Localized as="div" className="relative shrink-0 border-b border-[var(--color-border)] px-4 py-4 sm:px-5">
                  <Localized as="div" className="flex items-center justify-between gap-3">
                    <Localized as="div" className="min-w-0">
                      <Localized as="p" className="font-extrabold tracking-tight text-[var(--color-text)]">
                        Habla con Eduard
                      </Localized>
                      <Localized as="p" className="truncate text-sm text-[var(--color-text-muted)]">
                        Escríbenos a Soluciones Tecnológicas Ortegón
                      </Localized>
                    </Localized>

                    <Localized as="button"
                      onClick={onClose}
                      className="h-10 w-10 rounded-2xl bg-[var(--color-surface)] text-[var(--color-text-muted)] ring-1 ring-[var(--color-border)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/60"
                      aria-label="Cerrar"
                      title="Cerrar"
                      type="button"
                    >
                      ✕
                    </Localized>
                  </Localized>

                  <Localized as="div" className="mt-4 flex items-center justify-between gap-3">
                    <Localized as="div" className="flex items-center gap-2">
                      {CHANNELS.map((c) => (
                        <ChannelPill
                          key={c.id}
                          {...c}
                          active={channel === c.id}
                          onSelect={setChannel}
                        />
                      ))}
                    </Localized>

                    {channel === "instagram" && (
                      <Localized as="span" className="text-right text-[11px] leading-tight text-[var(--color-text-muted)]">
                        IG no siempre
                        <Localized as="br" />
                        prellena texto
                      </Localized>
                    )}
                  </Localized>
                </Localized>

                <Localized as="div" className="relative flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-5 space-y-3">
                  <Localized as="button"
                    onClick={applySuggestion}
                    type="button"
                    className="
                      group w-full rounded-2xl px-4 py-3 text-left
                      bg-[var(--color-surface)] ring-1 ring-[var(--color-border)] transition
                      hover:bg-[var(--color-surface)] hover:ring-[var(--color-accent)]/25
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/60
                    "
                  >
                    <Localized as="div" className="flex items-start gap-3">
                      <Localized as="span" className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/15 ring-1 ring-[var(--color-accent)]/20">
                        <Sparkles className="text-[var(--color-accent)]" />
                      </Localized>

                      <Localized as="div" className="min-w-0">
                        <Localized as="p" className="text-sm font-extrabold text-[var(--color-text-muted)]">
                          {suggestion.label}
                        </Localized>
                        <Localized as="p" className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
                          {suggestion.fill}
                        </Localized>
                      </Localized>

                      <Localized as="span" className="ml-auto shrink-0 text-xs font-bold text-[var(--color-text-muted)] transition group-hover:text-[var(--color-text-muted)]">
                        Usar
                      </Localized>
                    </Localized>
                  </Localized>

                  <Localized as="div" className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                    <Localized as="div" className="min-w-0 flex-1">
                      <Localized as="textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        maxLength={500}
                        aria-label="Mensaje para WhatsApp"
                        placeholder="Hola, quiero información sobre..."
                        className="
                          w-full resize-none rounded-2xl px-4 py-3
                          bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]
                          ring-1 ring-[var(--color-border)]
                          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/60
                        "
                      />
                      <Localized as="div" className="mt-2 flex items-center justify-between gap-3">
                        <Localized as="p" className="text-xs text-[var(--color-text-muted)]">
                          Se abrirá WhatsApp. Confirma allí el envío.
                        </Localized>
                        <Localized as="p" className="shrink-0 text-xs text-[var(--color-text-muted)]">
                          {message.length}/500
                        </Localized>
                      </Localized>
                    </Localized>

                    <Localized as="div" className="flex shrink-0 flex-row gap-2 sm:flex-col">
                      <Localized as="a"
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Continuar en WhatsApp"
                        title="Continuar en WhatsApp"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-bold text-[var(--color-text)] hover:bg-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border)]"
                      >
                        <FaPaperPlane aria-hidden="true" />
                        Continuar en WhatsApp
                      </Localized>

                      <IconAction onClick={clear} title="Limpiar">
                        <TrashIcon className="text-[18px]" />
                      </IconAction>
                    </Localized>
                  </Localized>
                </Localized>

                <Localized as="div" className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-[var(--color-primary)]/10 to-transparent" />
              </Localized>
            </Localized>
          </Localized>
        </Localized>
      )}
    </AnimatePresence>
  );
}

const Walkie = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState("whatsapp");
  const [message, setMessage] = useState("");

  const suggestion = useMemo(
    () => pickSuggestion(message, channel),
    [message, channel],
  );

  const links = useMemo(() => {
    const text = encodeURIComponent(
      `${language === "en" ? "Hi Eduard, I am contacting you from the Soluciones Tecnológicas Ortegón website." : "Hola Eduard, te escribo desde la página de Soluciones Tecnológicas Ortegón."}\n\n${message.trim() || translate("Quiero más información sobre tus servicios.", language)}`,
    );
    return {
      whatsapp: `https://wa.me/${CONTACTS.whatsappNumber}?text=${text}`,
      facebook: `https://m.me/${CONTACTS.facebookPage}`,
      instagram: `https://ig.me/m/${CONTACTS.instagramUsername}`,
      instagramFallback: `https://instagram.com/${CONTACTS.instagramUsername}`,
    };
  }, [message, language]);

  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);

  const clear = useCallback(() => setMessage(""), []);
  const applySuggestion = useCallback(
    () => setMessage(translate(suggestion.fill, language)),
    [suggestion.fill, language],
  );

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && closeChat();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [closeChat]);

  return (
    <>
      {/* Botón flotante
          MOBILE: centrado abajo y fijo
          DESKTOP: abajo derecha */}
      <Localized as="button"
        onClick={openChat}
        className={cx(
          `
    ortegon-chat-launcher fixed bottom-6 right-6 z-50
    group inline-flex items-center justify-center
    h-14 w-14 rounded-full
    bg-[var(--color-primary)]/90 text-[var(--color-text)]
    hover:bg-[var(--color-primary)] transition
    shadow-[0_22px_70px_-35px_rgba(192,253,185,0.95)]
    ring-1 ring-[var(--color-border)]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border)]
  `,

        )}
        aria-label="Abrir chat"
        title="Abrir chat"
        type="button"
      >
        <Localized as="span" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]">
          <Localized as="span" className="absolute -inset-2 rounded-full bg-[var(--color-bg-secondary)] opacity-0 transition group-hover:opacity-100" />
          <img src={robotAvatar} alt="" loading="lazy" decoding="async" />
        </Localized>
      </Localized>

      <WalkieModal
        open={open}
        onClose={closeChat}
        channel={channel}
        setChannel={setChannel}
        message={message}
        setMessage={setMessage}
        suggestion={suggestion}
        applySuggestion={applySuggestion}
        whatsappHref={links.whatsapp}
        clear={clear}
      />
    </>
  );
};

export default function ChatWidget() {
  return import.meta.env.VITE_CHAT_URL ? <AIChat /> : <Walkie />;
}
import AIChat from "./AIChat";
