// src/Pages/LoginForm.jsx
import React, { useState } from "react";
import InputBox from "../components/InputBox";
import AuthButton from "../components/AuthButton";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login Data:", form);
    // react-query mutation or redux dispatch can go here
  };

  return (
    <div className="flex flex-col w-full max-w-[512px] py-5 mx-auto">
      <h2 className="text-[#131612] text-[28px] font-bold text-center pb-3 pt-5">
        Welcome back
      </h2>

      <InputBox
        name="email"
        placeholder="Email or Student ID"
        value={form.email}
        onChange={handleChange}
      />

      <InputBox
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <p className="text-[#6f816a] text-sm text-right px-4 underline">
        Forgot Password?
      </p>

      <div className="px-4 py-3">
        <AuthButton label="Log In" onClick={handleLogin} variant="secondary" />
      </div>

      <p className="text-[#6f816a] text-sm text-center pb-1 pt-2">Or continue with</p>

      <div className="flex justify-center gap-3 px-4">
        <AuthButton label="Continue with Gmail" onClick={() => {}} variant="ghost" />
      </div>

      <div className="px-4 py-3">
        <p className="text-[#6d8566] text-sm text-center pt-2 underline">
          Don't have an account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </div>
    
  );
};

export default LoginForm;