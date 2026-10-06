import { Localized } from "../i18n/Language";
import React from "react";

const ProductFeatures = ({ features }) => {
  if (!features) return null;

  return (
    <Localized as="div" className="mt-8 flex flex-wrap gap-3">
      {features.map(({ label, Icon }) => (
        <Localized as="div"
          key={label}
          className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-primary)] px-4 py-2 backdrop-blur-xl"
        >
          <Icon className="size-4 text-[var(--color-text)]" />
          <Localized as="span" className="text-sm font-medium text-[var(--color-text)]">{label}</Localized>
        </Localized>
      ))}
    </Localized>
  );
};

export default ProductFeatures;