import { Localized, useLanguage, translate } from "../i18n/Language";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";

const QUOTE =
  "La IA es una herramienta, no un destino: el juicio, la ética y la creatividad siguen siendo tuyos.";
const AUTHOR = "— Anónimo";

const Background = memo(function Background() {
  return (
    <Localized as="div" className="pointer-events-none absolute inset-0">
      <Localized as="div"
        className="
          absolute -top-20 left-4
          h-32 w-32 rounded-full
          bg-[var(--color-primary)]/10
          blur-2xl
          sm:h-44 sm:w-44
          lg:h-56 lg:w-56
        "
      />

      <Localized as="div"
        className="
          absolute -bottom-20 right-4
          h-36 w-36 rounded-full
          bg-[var(--color-primary)]/5
          blur-2xl
          sm:h-48 sm:w-48
          lg:h-60 lg:w-60
        "
      />
    </Localized>
  );
});

export default function Quotes() {
  const { language } = useLanguage();
  const quote = translate(QUOTE, language);
  const author = translate(AUTHOR, language);
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [authorIndex, setAuthorIndex] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let quoteTimer;
    let authorTimer;

    quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => {
        if (prev >= quote.length) {
          clearInterval(quoteTimer);

          authorTimer = setInterval(() => {
            setAuthorIndex((aPrev) => {
              if (aPrev >= author.length) {
                clearInterval(authorTimer);
                return aPrev;
              }
              return aPrev + 1;
            });
          }, 80);

          return prev;
        }

        return prev + 1;
      });
    }, 55);

    return () => {
      clearInterval(quoteTimer);
      clearInterval(authorTimer);
    };
  }, [started, quote, author]);

  const typedQuote = useMemo(() => quote.slice(0, quoteIndex), [quoteIndex, quote]);
  const typedAuthor = useMemo(
    () => author.slice(0, authorIndex),
    [authorIndex, author],
  );

  const showCursor = started && authorIndex < author.length;

  return (
    <Localized as="section"
      ref={sectionRef}
      id="quotes"
      className="
    relative flex w-full
    min-h-[70svh] items-center justify-center
    overflow-hidden
    bg-[var(--color-bg-secondary)]
    border-[10px]
    border-[var(--color-accent)]
    px-4 py-16
    sm:min-h-[80svh] sm:px-6 sm:py-20
    lg:min-h-screen lg:px-8
  "
    >
      <Background />

      <Localized as="div" className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <Localized as="div"
          className="
    italianno-regular
    text-[var(--color-text-muted)]
    drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)]
  "
        >
          <Localized as="span" className="inline leading-[1.2] text-[clamp(1.45rem,4.8vw,3.4rem)] sm:text-[clamp(1.7rem,4.4vw,4rem)]">
            {typedQuote}
          </Localized>

          {showCursor && (
            <Localized as="span" className="typing-cursor ml-1 inline-block align-baseline sm:ml-2" />
          )}

          <Localized as="span" className="mt-4 block text-[clamp(1rem,2.8vw,2rem)] opacity-90 sm:mt-5">
            {typedAuthor}
          </Localized>
        </Localized>
      </Localized>
    </Localized>
  );
}
