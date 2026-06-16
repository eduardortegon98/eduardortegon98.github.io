import React from "react";

const ProductFeatures = ({ features }) => {
  if (!features) return null;

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {features.map(({ label, Icon }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-[#C0FDB9] px-4 py-2 backdrop-blur-xl"
        >
          <Icon className="size-4 text-black" />
          <span className="text-sm font-medium text-black">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductFeatures;