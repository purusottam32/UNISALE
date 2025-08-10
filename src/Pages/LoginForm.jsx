// src/Pages/LoginForm.jsx
import React, { useState } from "react";
import InputBox from "../components/InputBox";
import AuthButton from "../components/AuthButton";
import { useDispatch } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import { setUser } from "../redux/authSlice";
import Homepage from "../Pages/Homepage";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Login Data:", form);

        // Basic validation
    if (!form.email || !form.password) {
      setError("Please fill in both fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

     try {
      await authService.logOut(); // ✅ Ensure old session is cleared
      const account =await authService.login(form); // ✅ Call login from AuthService
      if (account) {
        const currentUser = await authService.getCurrentUser(); 
        if (currentUser) {
          dispatch(setUser(currentUser));
          console.log("navigating to home");
          navigate("/"); 
        } 
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } 


    // react-query mutation or redux d ispatch can go here
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