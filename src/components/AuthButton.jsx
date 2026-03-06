import React from "react";

const AuthButton = ({
  label,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}) => {
  const styles = {
    primary: "bg-[#50d22c] text-[#131712]",
    secondary: "bg-[#8cd279] text-[#131612]",
    ghost: "bg-[#f2f4f1] text-[#131612]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full h-10 px-4 w-full font-bold disabled:opacity-60 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default AuthButton;
