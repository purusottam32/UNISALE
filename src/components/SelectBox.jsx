
// src/components/Auth/SelectBox.jsx
import React from "react";

const SelectBox = ({ label, name, value, onChange, options = [] }) => {
  return (
    <div className="w-full px-4 py-3">
      {label && <p className="pb-2 font-medium text-[#131712]">{label}</p>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-input w-full rounded-xl h-14 p-4 bg-[#f1f4f1] text-[#131712] focus:outline-0"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
