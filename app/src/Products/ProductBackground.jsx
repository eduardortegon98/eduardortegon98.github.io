import { Localized } from "../i18n/Language";
import React from "react";

const ProductBackground = () => {
  return (
    <Localized as="div" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Localized as="div" className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
      <Localized as="div" className="absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-[var(--color-primary-soft)] blur-3xl" />
      <Localized as="div" className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_45%)]" />
    </Localized>
  );
};

export default ProductBackground;