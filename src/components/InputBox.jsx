// src/components/Auth/InputBox.jsx
import React from "react";

const InputBox = ({ label, name, type = "text", placeholder, value, onChange, ...rest }) => {
  return (
    <div className="w-full px-4 py-3">
      {label && <p className="pb-2 font-medium text-[#131712]">{label}</p>}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="form-input w-full rounded-xl h-14 p-4 bg-[#f1f4f1] text-[#131712] placeholder:text-[#6d8566] focus:outline-0"
        {...rest}
      />
    </div>
  );
};

export default InputBox;