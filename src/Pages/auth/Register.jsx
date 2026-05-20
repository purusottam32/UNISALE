import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import AuthVisual from "../../components/auth/AuthVisual";

export default function Register() {
  const { register, registerPending } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters.";
    if (!form.email.includes("@"))
      newErrors.email = "Please enter a valid college email address.";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await register({
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });
      toast.success(result?.message || "OTP sent to your email!");
      navigate("/verify-otp", { state: { email: form.email.toLowerCase().trim(), name: form.name.trim() } });
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed. Please try again.";
      const details = err?.response?.data?.details;
      if (details?.length) {
        const fieldErrors = {};
        details.forEach(({ field, message }) => { fieldErrors[field] = message; });
        setErrors(fieldErrors);
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
          {/* Logo */}
          <Link to="/" style={{ display: "inline-block", marginBottom: 40 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "var(--color-text-primary)", fontFamily: "'Syne', sans-serif" }}>
              Uni<span style={{ color: "var(--color-primary)" }}>Sale</span>
            </span>
          </Link>

          <div className="animate-fade-in">
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--color-text-primary)", marginBottom: 8 }}>
              Create your account
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 32 }}>
              Join your campus marketplace. Only verified college students allowed.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Name */}
              <div>
                <label className="input-label">Full Name</label>
                <div style={{ position: "relative" }}>
                  <FiUser style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", fontSize: 16 }} />
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Arjun Sharma"
                    className={`input-base ${errors.name ? "error" : ""}`}
                    style={{ paddingLeft: 40 }}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <p className="input-error">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="input-label">College Email</label>
                <div style={{ position: "relative" }}>
                  <FiMail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", fontSize: 16 }} />
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@iitb.ac.in"
                    className={`input-base ${errors.email ? "error" : ""}`}
                    style={{ paddingLeft: 40 }}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="input-error">{errors.email}</p>}
                <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>
                  Use your institutional email (.ac.in, .edu, etc.)
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="input-label">Password</label>
                <div style={{ position: "relative" }}>
                  <FiLock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", fontSize: 16 }} />
                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={`input-base ${errors.password ? "error" : ""}`}
                    style={{ paddingLeft: 40 }}
                    autoComplete="new-password"
                  />
                </div>
                {errors.password && <p className="input-error">{errors.password}</p>}
              </div>

              <button
                id="register-submit"
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={registerPending}
                style={{ marginTop: 4 }}
              >
                {registerPending ? (
                  <><div className="spinner" style={{ width: 18, height: 18 }} /> Creating account...</>
                ) : (
                  <>Create Account <FiArrowRight /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider-text" style={{ margin: "24px 0" }}>or</div>

            {/* Google OAuth */}
            <a
              id="google-signin-btn"
              href={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/api/auth/google`}
              className="btn btn-secondary btn-lg btn-full"
              style={{ gap: 10 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </a>

            <p style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: "var(--color-text-secondary)" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthVisual
        tagline="Your campus, your marketplace."
        stats={[
          { value: "40M+", label: "College students in India" },
          { value: "100%", label: "Verified student community" },
          { value: "0₹", label: "Platform fee" },
        ]}
      />
    </div>
  );
}
