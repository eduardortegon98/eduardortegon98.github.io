import React from "react";

const InputField = ({
  label,
  type,
  placeholder,
  icon: Icon,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="
            absolute left-4 top-1/2
            -translate-y-1/2
            text-white/40
          "
        />

        <input
          type={type}
          placeholder={placeholder}
          className="
            w-full rounded-2xl border border-white/10
            bg-black/40 py-3 pl-12 pr-4
            text-white placeholder:text-white/40
            outline-none transition
            focus:border-[#C0FDB9]
          "
        />
      </div>
    </div>
  );
};

export default InputField;