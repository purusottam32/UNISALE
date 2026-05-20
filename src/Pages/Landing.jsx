import { Link, Navigate } from "react-router-dom";
import { FiArrowRight, FiShield, FiUsers, FiZap, FiStar, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: FiUsers,
    title: "Campus-only community",
    description: "Trade only with verified students using your institutional .ac.in or .edu email. No strangers.",
    color: "#7c6af7",
    bg: "rgba(124, 106, 247, 0.12)",
  },
  {
    icon: FiShield,
    title: "Safe & trusted",
    description: "Email verification, abuse reporting, and admin moderation protect every transaction.",
    color: "#34d399",
    bg: "rgba(52, 211, 153, 0.12)",
  },
  {
    icon: FiZap,
    title: "Real-time chat",
    description: "Message sellers instantly. Negotiate, set pickup, and close deals — all within UniSale.",
    color: "#f97066",
    bg: "rgba(249, 112, 102, 0.12)",
  },
];

const STATS = [
  { value: "40M+", label: "College students in India" },
  { value: "0₹", label: "Platform commission" },
  { value: "100%", label: "Verified student community" },
  { value: "<30s", label: "To list your first item" },
];

const CATEGORIES = [
  { emoji: "💻", name: "Electronics", count: "Most popular" },
  { emoji: "📚", name: "Books & Notes", count: "Save ₹₹₹" },
  { emoji: "🛋️", name: "Furniture", count: "Hostel essentials" },
  { emoji: "👕", name: "Fashion", count: "Like-new deals" },
  { emoji: "🚲", name: "Sports & Fitness", count: "Stay active" },
  { emoji: "🔧", name: "Gadgets & Accessories", count: "Tech essentials" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    college: "IIT Bombay",
    dept: "CS, 3rd Year",
    avatar: "PS",
    text: "Sold my old laptop in 2 hours! The buyer was right in my hostel block. This is exactly what we needed.",
  },
  {
    name: "Rohan Gupta",
    college: "BITS Pilani",
    dept: "ECE, 2nd Year",
    avatar: "RG",
    text: "Bought a full set of reference books for 40% of the MRP. The seller even delivered to my room. 🔥",
  },
  {
    name: "Aisha Khan",
    college: "NIT Trichy",
    dept: "Mech, 4th Year",
    avatar: "AK",
    text: "Listed my cycle as I was graduating. Had 5 chats within the first day. UniSale is the real deal.",
  },
];

export default function Landing() {
  const { isAuthenticated, isLoading, isProfileComplete } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)" }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isProfileComplete ? "/feed" : "/complete-profile"} replace />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text-primary)", overflowX: "hidden" }}>
      {/* Ambient background */}
      <div className="mesh-bg" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      {/* ── Navbar ───────────────────────────────── */}
      <header style={{ position: "relative", zIndex: 10, borderBottom: "1px solid var(--color-border)", backdropFilter: "blur(12px)", background: "rgba(13,13,16,0.85)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <Link to="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800 }}>
            Uni<span style={{ color: "var(--color-primary)" }}>Sale</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/explore" className="btn btn-ghost btn-sm">Browse</Link>
            <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started <FiArrowRight />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px 60px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }} className="animate-fade-in">
          <div className="badge badge-primary" style={{ marginBottom: 24, padding: "6px 16px", fontSize: 13 }}>
            🎓 India's first verified campus marketplace
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            Buy, sell & trade<br />
            <span className="text-gradient">right on campus</span>
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px" }}>
            UniSale is the only marketplace that verifies every student with their college email — so you always know who you&apos;re trading with.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start selling for free <FiArrowRight />
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-lg">
              Browse listings
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginTop: 32 }}>
            {["✓ Institutional email verified", "✓ 0% platform commission", "✓ Real-time chat"].map((t) => (
              <span key={t} style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating listing cards */}
        <div style={{ maxWidth: 900, margin: "56px auto 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, position: "relative" }}>
          {[
            { emoji: "💻", title: "MacBook Air M2", price: "₹65,000", college: "IIT Bombay", condition: "Like New", color: "#7c6af7" },
            { emoji: "📚", title: "MTech Notes Bundle", price: "₹450", college: "BITS Pilani", condition: "Good", color: "#34d399" },
            { emoji: "🚲", title: "Hero Cycle", price: "₹2,200", college: "NIT Trichy", condition: "Fair", color: "#f97066" },
          ].map((item, i) => (
            <div
              key={item.title}
              className="card card-interactive animate-fade-scale"
              style={{ padding: 16, animationDelay: `${i * 0.1}s` }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${item.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {item.emoji}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{item.college}</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.price}</span>
                <span className="badge badge-primary" style={{ fontSize: 11 }}>{item.condition}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--color-border)", borderRadius: 20, overflow: "hidden" }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ background: "var(--color-surface)", padding: "28px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: "var(--color-primary)", fontFamily: "'Syne', sans-serif" }}>{value}</p>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: 12 }}>
              Built for campus life
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 16 }}>
              Every feature designed around how students actually trade
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="card" style={{ padding: 28 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon style={{ fontSize: 24, color }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.7 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "20px 24px 60px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(20px, 3vw, 28px)" }}>
              Popular categories
            </h2>
            <Link to="/explore" style={{ color: "var(--color-primary)", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              View all <FiArrowRight />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
            {CATEGORIES.map(({ emoji, name, count }) => (
              <Link
                key={name}
                to={`/explore?category=${encodeURIComponent(name)}`}
                className="card card-interactive"
                style={{ padding: "20px 16px", textAlign: "center", display: "block" }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{emoji}</div>
                <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{name}</p>
                <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "20px 24px 60px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 12 }}>
              {[1,2,3,4,5].map(i => <FiStar key={i} style={{ color: "#fbbf24", fill: "#fbbf24" }} />)}
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3vw, 32px)" }}>
              What students say
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map(({ name, college, dept, avatar, text }) => (
              <div key={name} className="card glass-surface" style={{ padding: 24 }}>
                <p style={{ color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                  &ldquo;{text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-primary), #a78bfa)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
                  }}>
                    {avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{name}</p>
                    <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{dept} · {college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "20px 24px 60px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3vw, 32px)" }}>
              Up & running in 3 steps
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { step: "01", title: "Verify your college email", desc: "Register with your .ac.in or .edu email. We send a 6-digit OTP to confirm your student identity." },
              { step: "02", title: "Complete your campus profile", desc: "Add your college, department, and year. This helps buyers trust your listings and makes your feed relevant." },
              { step: "03", title: "Start buying & selling", desc: "Browse listings from your campus, message sellers in real-time, and list your own items in under a minute." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="card" style={{ padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 900,
                  color: "var(--color-primary)", opacity: 0.3, lineHeight: 1, flexShrink: 0, minWidth: 52,
                }}>
                  {step}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{title}</h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="card glass" style={{ padding: "56px 40px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
              {["IIT Bombay", "BITS Pilani", "NIT Trichy", "VIT"].map(c => (
                <span key={c} className="badge badge-muted" style={{ fontSize: 11 }}>{c}</span>
              ))}
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 4vw, 36px)", marginBottom: 12 }}>
              Join your campus marketplace
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: 32, maxWidth: 460, margin: "0 auto 32px" }}>
              Sign up free. Verify in 30 seconds. Browse listings from students at your college right now.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create free account <FiArrowRight />
              </Link>
              <Link to="/explore" className="btn btn-secondary btn-lg">
                Browse without signing up
              </Link>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24 }}>
              {["No listing fees", "No middlemen", "Instant chat"].map(t => (
                <span key={t} style={{ fontSize: 13, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  <FiCheckCircle style={{ color: "var(--color-success)", fontSize: 14 }} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid var(--color-border)", padding: "32px 24px" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800 }}>
            Uni<span style={{ color: "var(--color-primary)" }}>Sale</span>
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            <Link to="/explore" style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Explore</Link>
            <Link to="/register" style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Sign up</Link>
            <Link to="/login" style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Login</Link>
          </div>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} UniSale · Made for campus communities
          </p>
        </div>
      </footer>
    </div>
  );
}
