import { Localized } from "../../i18n/Language";
import React from "react";

const InputField = ({
  label,
  type,
  placeholder,
  icon: Icon,
}) => {
  return (
    <Localized as="div">
      <Localized as="label" className="mb-2 block text-sm font-medium">
        {label}
      </Localized>

      <Localized as="div" className="relative">
        <Icon
          size={18}
          className="
            absolute left-4 top-1/2
            -translate-y-1/2
            text-[var(--color-text-muted)]
          "
        />

        <Localized as="input"
          type={type}
          placeholder={placeholder}
          className="
            w-full rounded-2xl border border-[var(--color-border)]
            bg-[var(--color-bg-secondary)] py-3 pl-12 pr-4
            text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]
            outline-none transition
            focus:border-[var(--color-accent)]
          "
        />
      </Localized>
    </Localized>
  );
};

export default InputField;