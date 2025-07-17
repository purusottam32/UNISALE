// src/components/Auth/AuthButton.jsx
import React from "react";

const AuthButton = ({ label, onClick, variant = "primary" }) => {
  const styles = {
    primary: "bg-[#50d22c] text-[#131712]",
    secondary: "bg-[#8cd279] text-[#131612]",
    ghost: "bg-[#f2f4f1] text-[#131612]",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-full h-10 px-4 w-full font-bold ${styles[variant]}`}
    >
      {label}
    </button>
  );
};

export default AuthButton;