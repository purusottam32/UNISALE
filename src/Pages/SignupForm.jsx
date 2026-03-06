import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputBox from "../components/InputBox";
import SelectBox from "../components/SelectBox";
import AuthButton from "../components/AuthButton";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";

const collegeOptions = [
  { value: "SOA", label: "SOA University" },
  { value: "KIIT", label: "KIIT" },
  { value: "NITR", label: "NIT Rourkela" },
];

const SignupForm = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setError("");

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.avatar?.[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    try {
      await registerUser(formData);
      toast.success("Account created successfully.");
      navigate("/", { replace: true });
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Signup failed.");
      setError(message);
      toast.error(message);
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
          placeholder="Enter your name"
          {...register("name", {
            required: "Full name is required",
            pattern: {
              value: /^[A-Za-z\s]{2,30}$/,
              message: "Name should be 2-30 characters and contain only letters",
            },
          })}
        />
        {errors.name && <p className="text-red-500 text-sm px-4">{errors.name.message}</p>}

        <InputBox
          label="Email"
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && <p className="text-red-500 text-sm px-4">{errors.email.message}</p>}

        <SelectBox
          label="College"
          options={collegeOptions}
          {...register("college")}
        />

        <InputBox
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && <p className="text-red-500 text-sm px-4">{errors.password.message}</p>}

        <div className="w-full px-4 py-3">
          <p className="pb-2 font-medium text-[#131712]">Avatar (optional)</p>
          <input
            type="file"
            accept="image/*"
            {...register("avatar")}
            className="form-input w-full rounded-xl h-14 p-4 bg-[#f1f4f1] text-[#131712]"
          />
        </div>

        {error && <p className="text-red-500 text-sm px-4">{error}</p>}

        <div className="px-4 py-3">
          <AuthButton
            label={isSubmitting ? "Signing up..." : "Sign up"}
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          />
          <p className="text-[#6d8566] text-sm text-center pt-2 underline">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
