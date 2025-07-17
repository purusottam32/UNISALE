// src/components/AuthForm/SignupForm.jsx
import React, { useState } from "react";
import InputBox from "../components/InputBox";
import SelectBox from "../components/SelectBox";
import AuthButton from "../components/AuthButton";
import { Link } from "react-router-dom";
const collegeOptions = [
  { value: "SOA", label: "SOA University" },
  { value: "KIIT", label: "KIIT" },
  { value: "NITR", label: "NIT Rourkela" },
];

const SignupForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup Data:", form);
    // react-query mutation goes here
  };

  return (
    <div className="flex flex-col w-full max-w-[512px] py-5 mx-auto">
      <h2 className="text-[#131712] text-[28px] font-bold text-center pb-3 pt-5">
        Create an account
      </h2>

      <InputBox
        label="Name"
        name="name"
        placeholder="Enter your name"
        value={form.name}
        onChange={handleChange}
      />

      <InputBox
        label="Email"
        name="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
      />

      <SelectBox
        label="College"
        name="college"
        value={form.college}
        onChange={handleChange}
        options={collegeOptions}
      />

      <InputBox
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={handleChange}
      />

      <div className="px-4 py-3">
        <AuthButton label="Sign up" onClick={handleSignup} variant="primary" />
        <p className="text-[#6d8566] text-sm text-center pt-2 underline">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;