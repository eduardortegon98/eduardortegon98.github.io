import React from "react";

const ContactCard = ({ icon: Icon, title, value }) => {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="rounded-xl bg-[var(--color-primary)]/10 p-3">
        <Icon size={22} className="text-[var(--color-accent)]" />
      </div>

      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 ">{value}</p>
      </div>
    </div>
  );
};

export default ContactCard;