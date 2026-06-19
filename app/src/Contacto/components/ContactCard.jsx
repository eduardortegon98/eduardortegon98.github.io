import React from "react";

const ContactCard = ({ icon: Icon, title, value }) => {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white bg-[var(--color-text)]/15 p-5">
      <div className="rounded-xl bg-[#C0FDB9]/10 p-3">
        <Icon size={22} className="text-[#C0FDB9]" />
      </div>

      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 ">{value}</p>
      </div>
    </div>
  );
};

export default ContactCard;