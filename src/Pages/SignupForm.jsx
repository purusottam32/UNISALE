// src/components/AuthForm/SignupForm.jsx
import React, { useState } from "react";
import InputBox from "../components/InputBox";
import SelectBox from "../components/SelectBox";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import AuthButton from "../components/AuthButton";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";


const collegeOptions = [
  { value: "SOA", label: "SOA University" },
  { value: "KIIT", label: "KIIT" },
  { value: "NITR", label: "NIT Rourkela" },
];

const SignupForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async(data) => {
    console.log("Signup Data:", data);
     setError("");
     try{
      const userData=await authService.createAccount(data);
      if(userData){
        const userData = await authService.getCurrentUser();
        if(userData) dispatch(login(userData));
        navigate("/");
      }
     }catch(error){
       setError(error.message);
     }
    
  };

 

  return (
    <div className="flex flex-col w-full max-w-[512px] py-5 mx-auto">
      
      <h2 className="text-[#131712] text-[28px] font-bold text-center pb-3 pt-5">
        Create an account
      </h2>
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputBox
        label="Name"
        name="name"
        placeholder="Enter your name"
         {...register("name", {
            required: "Full name is required",
            pattern: {
              value: /^[A-Za-z\s]{2,30}$/,
              message: "Name should be 2-30 characters and contain only letters",
            },
          })}
        aria-invalid={errors.name ? "true" : "false"}

      />
       {errors.name && <p className="text-red-500 text-sm px-4">{errors.name.message}</p>}


      <InputBox
        label="Email"
        name="email"
        placeholder="Enter your email"
        {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
        })}
        aria-invalid={errors.email ? "true" : "false"}

      />
      {errors.email && <p className="text-red-500 text-sm px-4">{errors.email.message}</p>}


      <SelectBox
        label="College"
        name="college"
        options={collegeOptions}
        {...register("college", { required: "College is required" })}
      />
      {errors.college && <p className="text-red-500 text-sm px-4">{errors.college.message}</p>}


      <InputBox
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
              message:
                "Password must include uppercase, lowercase, number, and special character",
            },
          })}
          aria-invalid={errors.password ? "true" : "false"}
      />
      {errors.password && <p className="text-red-500 text-sm px-4">{errors.password.message}</p>}

      <div className="px-4 py-3">
        <AuthButton label="Sign up" type="Submit" variant="primary" />
        <p className="text-[#6d8566] text-sm text-center pt-2 underline">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
     </form>
    </div>
  );
};

export default SignupForm;