import { Localized } from "../../i18n/Language";
import React from "react";

const ContactCard = ({ icon: Icon, title, value }) => {
  return (
    <Localized as="div" className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <Localized as="div" className="rounded-xl bg-[var(--color-primary)]/10 p-3">
        <Icon size={22} className="text-[var(--color-accent)]" />
      </Localized>

      <Localized as="div">
        <Localized as="p" className="font-semibold">{title}</Localized>
        <Localized as="p" className="mt-1 ">{value}</Localized>
      </Localized>
    </Localized>
  );
};

export default ContactCard;