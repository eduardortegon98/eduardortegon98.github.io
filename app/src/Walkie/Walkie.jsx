import React, { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Mic, TrashIcon, Sparkles } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPaperPlane,
} from "react-icons/fa";

const CONTACTS = {
  whatsappNumber: "57XXXXXXXXXX",
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
    <button
      onClick={() => onSelect(id)}
      type="button"
      aria-label={title}
      title={title}
      className={cx(
        "group relative overflow-hidden inline-flex items-center justify-center",
        "h-11 w-14 rounded-2xl ring-1 transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C0FDB9]/60",
        active
          ? "bg-[#C0FDB9]/90 text-black ring-white/10"
          : "bg-white/5 text-white/80 hover:text-white hover:bg-white/10 ring-white/10",
      )}
    >
      <span
        className={cx(
          "pointer-events-none absolute -inset-10 blur-2xl transition",
          active
            ? "bg-[#C0FDB9]/22 opacity-100"
            : "bg-[#C0FDB9]/16 opacity-0 group-hover:opacity-100",
        )}
      />
      <Icon className="relative text-[18px]" />
    </button>
  );
}

function IconAction({ onClick, title, children, variant = "ghost" }) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={title}
      title={title}
      className={cx(
        "group relative overflow-hidden inline-flex items-center justify-center",
        "h-11 w-11 sm:h-12 sm:w-12 rounded-2xl ring-1 transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C0FDB9]/60",
        variant === "primary"
          ? "bg-[#C0FDB9]/90 hover:bg-[#C0FDB9] text-black ring-white/10 shadow-[0_18px_55px_-35px_rgba(192,253,185,0.95)]"
          : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white ring-white/10 hover:ring-[#C0FDB9]/25",
      )}
    >
      {variant === "primary" && (
        <>
          <span className="pointer-events-none absolute -inset-10 bg-[#C0FDB9]/25 blur-2xl opacity-0 group-hover:opacity-100 transition" />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/40 via-white/10 to-transparent opacity-55 group-hover:opacity-75 transition" />
        </>
      )}
      <span className="relative">{children}</span>
    </button>
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
  send,
  clear,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60]"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Cerrar modal"
            type="button"
            variants={overlayVariants}
          />

          {/* MOBILE: centrado vertical
              DESKTOP: abajo derecha */}
          <div
            className="
              absolute inset-x-4 top-1/2 -translate-y-1/2
              sm:left-auto sm:right-6 sm:top-auto sm:bottom-6 sm:translate-y-0 sm:inset-x-auto
            "
          >
            <div className="mx-auto w-full max-w-[560px] sm:mx-0 sm:w-[92vw] sm:max-w-md">
              <motion.div
                variants={modalVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={cx(
                  "relative overflow-hidden rounded-3xl",
                  "bg-[#0b0d12]/95 backdrop-blur-xl ring-1 ring-white/10",
                  "shadow-[0_40px_120px_-70px_rgba(192,253,185,0.95)]",
                  "max-h-[calc(100svh-2rem)] sm:max-h-[calc(100svh-3rem)] flex flex-col",
                )}
              >
                <motion.div
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

                <div className="pointer-events-none absolute -top-10 left-0 right-0 h-24 bg-[#C0FDB9]/20 blur-3xl" />

                <div className="relative shrink-0 border-b border-white/10 px-4 py-4 sm:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-extrabold tracking-tight text-white">
                        Enviar mensaje
                      </p>
                      <p className="truncate text-sm text-white/55">
                        Elige canal, escribe y envía
                      </p>
                    </div>

                    <button
                      onClick={onClose}
                      className="h-10 w-10 rounded-2xl bg-white/5 text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C0FDB9]/60"
                      aria-label="Cerrar"
                      title="Cerrar"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {CHANNELS.map((c) => (
                        <ChannelPill
                          key={c.id}
                          {...c}
                          active={channel === c.id}
                          onSelect={setChannel}
                        />
                      ))}
                    </div>

                    {channel === "instagram" && (
                      <span className="text-right text-[11px] leading-tight text-white/40">
                        IG no siempre
                        <br />
                        prellena texto
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-5 space-y-3">
                  <button
                    onClick={applySuggestion}
                    type="button"
                    className="
                      group w-full rounded-2xl px-4 py-3 text-left
                      bg-white/5 ring-1 ring-white/10 transition
                      hover:bg-white/10 hover:ring-[#C0FDB9]/25
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C0FDB9]/60
                    "
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C0FDB9]/15 ring-1 ring-[#C0FDB9]/20">
                        <Sparkles className="text-[#C0FDB9]" />
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-white/85">
                          {suggestion.label}
                        </p>
                        <p className="mt-1 truncate text-xs text-white/50">
                          {suggestion.fill}
                        </p>
                      </div>

                      <span className="ml-auto shrink-0 text-xs font-bold text-white/50 transition group-hover:text-white/70">
                        Usar
                      </span>
                    </div>
                  </button>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                    <div className="min-w-0 flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        placeholder="Hola, quiero información sobre..."
                        className="
                          w-full resize-none rounded-2xl px-4 py-3
                          bg-white/5 text-white placeholder:text-white/35
                          ring-1 ring-white/10
                          focus:outline-none focus:ring-2 focus:ring-[#C0FDB9]/60
                        "
                      />
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="truncate text-xs text-white/40">
                          WhatsApp prellena el texto.
                        </p>
                        <p className="shrink-0 text-xs text-white/35">
                          {Math.min(message.length, 500)}/500
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                      <IconAction
                        onClick={send}
                        title="Enviar"
                        variant="primary"
                      >
                        <FaPaperPlane className="text-[18px]" />
                      </IconAction>

                      <IconAction
                        onClick={() => console.log("Mic")}
                        title="Audio (próximamente)"
                      >
                        <Mic className="text-[18px]" />
                      </IconAction>

                      <IconAction onClick={clear} title="Limpiar">
                        <TrashIcon className="text-[18px]" />
                      </IconAction>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-[#C0FDB9]/10 to-transparent" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Walkie = () => {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState("whatsapp");
  const [message, setMessage] = useState("");

  const suggestion = useMemo(
    () => pickSuggestion(message, channel),
    [message, channel],
  );

  const links = useMemo(() => {
    const text = encodeURIComponent(
      message || "Hola, quiero más información 😊",
    );
    return {
      whatsapp: `https://wa.me/${CONTACTS.whatsappNumber}?text=${text}`,
      facebook: `https://m.me/${CONTACTS.facebookPage}`,
      instagram: `https://ig.me/m/${CONTACTS.instagramUsername}`,
      instagramFallback: `https://instagram.com/${CONTACTS.instagramUsername}`,
    };
  }, [message]);

  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);

  const send = useCallback(() => {
    if (channel === "instagram") {
      const dm = window.open(links.instagram, "_blank", "noopener,noreferrer");
      if (!dm) {
        window.open(links.instagramFallback, "_blank", "noopener,noreferrer");
      }
      return;
    }

    window.open(links[channel], "_blank", "noopener,noreferrer");
  }, [channel, links]);

  const clear = useCallback(() => setMessage(""), []);
  const applySuggestion = useCallback(
    () => setMessage(suggestion.fill),
    [suggestion.fill],
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
      <button
        onClick={openChat}
        className={cx(
          `
    fixed bottom-[40svh] right-0 -translate-y-1/2 -translate-x-1/2 z-50
    sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0
    group inline-flex items-center justify-center
    h-14 w-14 rounded-full
    bg-[#C0FDB9]/90 text-black
    hover:bg-[#C0FDB9] transition
    shadow-[0_22px_70px_-35px_rgba(192,253,185,0.95)]
    ring-1 ring-white/10
    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
  `,
          !open && "animate-bounce",
        )}
        aria-label="Abrir chat"
        title="Abrir chat"
        type="button"
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black/10">
          <span className="absolute -inset-2 rounded-full bg-black/10 opacity-0 transition group-hover:opacity-100" />
          <Bot />
        </span>
      </button>

      <WalkieModal
        open={open}
        onClose={closeChat}
        channel={channel}
        setChannel={setChannel}
        message={message}
        setMessage={setMessage}
        suggestion={suggestion}
        applySuggestion={applySuggestion}
        send={send}
        clear={clear}
      />
    </>
  );
};

export default Walkie;
