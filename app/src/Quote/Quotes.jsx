import React, { memo, useEffect, useMemo, useRef, useState } from "react";

const QUOTE =
  "La IA es una herramienta, no un destino: el juicio, la ética y la creatividad siguen siendo tuyos.";
const AUTHOR = "— Anónimo";

const Background = memo(function Background() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="
          absolute -top-20 left-4
          h-32 w-32 rounded-full
          bg-[var(--color-primary)]/10
          blur-2xl
          sm:h-44 sm:w-44
          lg:h-56 lg:w-56
        "
      />

      <div
        className="
          absolute -bottom-20 right-4
          h-36 w-36 rounded-full
          bg-[var(--color-primary)]/5
          blur-2xl
          sm:h-48 sm:w-48
          lg:h-60 lg:w-60
        "
      />
    </div>
  );
});

export default function Quotes() {
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
        if (prev >= QUOTE.length) {
          clearInterval(quoteTimer);

          authorTimer = setInterval(() => {
            setAuthorIndex((aPrev) => {
              if (aPrev >= AUTHOR.length) {
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
  }, [started]);

  const typedQuote = useMemo(() => QUOTE.slice(0, quoteIndex), [quoteIndex]);
  const typedAuthor = useMemo(
    () => AUTHOR.slice(0, authorIndex),
    [authorIndex],
  );

  const showCursor = started && authorIndex < AUTHOR.length;

  return (
    <section
      ref={sectionRef}
      id="quotes"
      className="
    relative flex w-full
    min-h-[70svh] items-center justify-center
    overflow-hidden
    bg-[var(--color-bg-secondary)]
    border-[10px]
    border-[#248f26]
    px-4 py-16
    sm:min-h-[80svh] sm:px-6 sm:py-20
    lg:min-h-screen lg:px-8
  "
    >
      <Background />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <div
          className="
    italianno-regular
    text-[var(--color-surface)]
    drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)]
  "
        >
          <span className="inline leading-[1.2] text-[clamp(1.45rem,4.8vw,3.4rem)] sm:text-[clamp(1.7rem,4.4vw,4rem)]">
            {typedQuote}
          </span>

          {showCursor && (
            <span className="typing-cursor ml-1 inline-block align-baseline sm:ml-2" />
          )}

          <span className="mt-4 block text-[clamp(1rem,2.8vw,2rem)] opacity-90 sm:mt-5">
            {typedAuthor}
          </span>
        </div>
      </div>
    </section>
  );
}
