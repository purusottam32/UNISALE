import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiUser, FiBook, FiCalendar, FiArrowRight, FiCheckCircle } from "react-icons/fi";

const DEPARTMENTS = [
  "Computer Science", "Electrical Engineering", "Mechanical Engineering",
  "Civil Engineering", "Electronics & Communication", "Chemical Engineering",
  "Biotechnology", "Information Technology", "Physics", "Mathematics",
  "Chemistry", "Economics", "Management", "Architecture", "Law",
  "Medicine", "Pharmacy", "Design", "Arts & Humanities", "Other",
];

export default function CompleteProfile() {
  const { completeProfile, completeProfilePending, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: user?.username || "",
    college: user?.college || "",
    department: user?.department || "",
    year: user?.year || "",
    bio: user?.bio || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (form.username && !/^[a-z0-9_]{3,30}$/.test(form.username.toLowerCase())) {
      e.username = "Username must be 3–30 characters (lowercase letters, numbers, underscores).";
    }
    if (!form.college.trim() || form.college.trim().length < 2) e.college = "Enter your college name.";
    if (!form.department) e.department = "Select your department.";
    if (!form.year || form.year < 1 || form.year > 6) e.year = "Select your current year.";
    if (form.bio && form.bio.length > 160) e.bio = "Bio cannot exceed 160 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    if (form.username.trim()) formData.append("username", form.username.toLowerCase().trim());
    formData.append("college", form.college.trim());
    formData.append("department", form.department);
    formData.append("year", form.year);
    if (form.bio) formData.append("bio", form.bio.trim());

    try {
      await completeProfile(formData);
      toast.success("Profile complete! Let's find some deals 🎉");
      navigate("/feed");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to save profile.";
      toast.error(msg);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }} className="animate-fade-in">
          <div style={{
            width: 64, height: 64,
            background: "linear-gradient(135deg, var(--color-primary), #a78bfa)",
            borderRadius: "var(--radius-xl)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 28,
          }}>
            🎓
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
            Complete your profile
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: 15 }}>
            Tell your campus community a bit about yourself.
            <br />You can&apos;t post listings until your profile is complete.
          </p>
        </div>

        {/* Card */}
        <div className="card animate-fade-scale" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Username */}
            <div>
              <label className="input-label">Username (optional)</label>
              <input
                id="profile-username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="e.g. rahul_iitb"
                className={`input-base ${errors.username ? "error" : ""}`}
              />
              {errors.username && <p className="input-error">{errors.username}</p>}
            </div>

            {/* College */}
            <div>
              <label className="input-label">
                <FiUser style={{ marginRight: 6, display: "inline" }} />
                College / University Name
              </label>
              <input
                id="profile-college"
                name="college"
                type="text"
                value={form.college}
                onChange={handleChange}
                placeholder="e.g. IIT Bombay"
                className={`input-base ${errors.college ? "error" : ""}`}
              />
              {errors.college && <p className="input-error">{errors.college}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="input-label">
                <FiBook style={{ marginRight: 6, display: "inline" }} />
                Department
              </label>
              <select
                id="profile-department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className={`input-base ${errors.department ? "error" : ""}`}
              >
                <option value="">Select your department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="input-error">{errors.department}</p>}
            </div>

            {/* Year */}
            <div>
              <label className="input-label">
                <FiCalendar style={{ marginRight: 6, display: "inline" }} />
                Current Year
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <button
                    key={y}
                    type="button"
                    id={`year-btn-${y}`}
                    onClick={() => { setForm((p) => ({ ...p, year: y })); setErrors((e) => ({ ...e, year: "" })); }}
                    style={{
                      padding: "10px 0",
                      borderRadius: "var(--radius-md)",
                      background: form.year === y ? "var(--color-primary)" : "var(--color-surface-2)",
                      border: form.year === y ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                      color: form.year === y ? "#fff" : "var(--color-text-secondary)",
                      fontWeight: 600,
                      fontSize: 14,
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    Y{y}
                  </button>
                ))}
              </div>
              {errors.year && <p className="input-error">{errors.year}</p>}
            </div>

            {/* Bio */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label className="input-label">Bio (optional)</label>
                <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{form.bio.length}/160</span>
              </div>
              <textarea
                id="profile-bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell buyers and sellers a bit about yourself..."
                className={`input-base ${errors.bio ? "error" : ""}`}
                rows={3}
                style={{ resize: "vertical", minHeight: 80 }}
              />
              {errors.bio && <p className="input-error">{errors.bio}</p>}
            </div>

            <button
              id="complete-profile-submit"
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={completeProfilePending}
              style={{ marginTop: 4 }}
            >
              {completeProfilePending ? (
                <><div className="spinner" style={{ width: 18, height: 18 }} /> Saving...</>
              ) : (
                <>
                  <FiCheckCircle />
                  Complete Profile &amp; Enter Marketplace
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
