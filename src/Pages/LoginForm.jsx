import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InputBox from "../components/InputBox";
import AuthButton from "../components/AuthButton";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      const message = "Please fill in both fields.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      await login(form);
      toast.success("Login successful.");

      const redirectPath = location.state?.from?.pathname || "/";
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Login failed.");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[512px] py-5 mx-auto">
      <h2 className="text-[#131612] text-[28px] font-bold text-center pb-3 pt-5">
        Welcome back
      </h2>

      <form onSubmit={handleLogin}>
        <InputBox
          name="email"
          placeholder="Email"
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

        {error && <p className="text-red-500 text-sm px-4">{error}</p>}

        <div className="px-4 py-3">
          <AuthButton
            label={loading ? "Logging in..." : "Log In"}
            type="submit"
            variant="secondary"
            disabled={loading}
          />
        </div>

        <p className="text-[#6d8566] text-sm text-center pb-1 pt-2">Or continue with</p>

        <div className="flex justify-center gap-3 px-4">
          <AuthButton label="Continue with Gmail" variant="ghost" disabled />
        </div>

        <div className="px-4 py-3">
          <p className="text-[#6d8566] text-sm text-center pt-2 underline">
            Don&apos;t have an account? <Link to="/signup">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
