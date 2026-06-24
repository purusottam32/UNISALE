"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiHome,
  FiMapPin,
  FiMonitor,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTool,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const FEATURES = [
  {
    icon: FiUsers,
    title: "Campus-only community",
    description: "Trade only with verified students using your institutional .ac.in or .edu email. No strangers.",
  },
  {
    icon: FiShield,
    title: "Safe and trusted",
    description: "Email verification, abuse reporting, and admin moderation protect every transaction.",
  },
  {
    icon: FiZap,
    title: "Real-time chat",
    description: "Message sellers instantly. Negotiate, set pickup, and close deals within UniSale.",
  },
];

const STATS = [
  { value: "40M+", label: "College students in India" },
  { value: "Rs. 0", label: "Platform commission" },
  { value: "100%", label: "Verified student community" },
  { value: "<30s", label: "To list your first item" },
];

const CATEGORIES = [
  { icon: FiMonitor, name: "Electronics", count: "Most popular" },
  { icon: FiBookOpen, name: "Books and Notes", count: "Study essentials" },
  { icon: FiHome, name: "Furniture", count: "Hostel essentials" },
  { icon: FiShoppingBag, name: "Fashion", count: "Like-new deals" },
  { icon: FiActivity, name: "Sports and Fitness", count: "Stay active" },
  { icon: FiTool, name: "Gadgets and Accessories", count: "Tech essentials" },
];

const FEATURED_LISTINGS = [
  {
    title: "MacBook Air M2",
    price: "Rs. 65,000",
    college: "IIT Bombay",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "MTech Notes Bundle",
    price: "Rs. 450",
    college: "BITS Pilani",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1544652478-665375a24532?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Hero Cycle",
    price: "Rs. 2,200",
    college: "NIT Trichy",
    condition: "Fair",
    image: "https://images.unsplash.com/photo-14859213210 Ia9-f6e98389f1f?auto=format&fit=crop&w=700&q=80",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    college: "IIT Bombay",
    dept: "CS, 3rd Year",
    avatar: "PS",
    text: "Sold my old laptop in 2 hours. The buyer was right in my hostel block. This is exactly what we needed.",
  },
  {
    name: "Rohan Gupta",
    college: "BITS Pilani",
    dept: "ECE, 2nd Year",
    avatar: "RG",
    text: "Bought a full set of reference books for 40% of the MRP. The seller even delivered to my room.",
  },
  {
    name: "Aisha Khan",
    college: "NIT Trichy",
    dept: "Mech, 4th Year",
    avatar: "AK",
    text: "Listed my cycle as I was graduating. Had 5 chats within the first day. UniSale is the real deal.",
  },
];

const TRUST_ITEMS = ["Institutional email verified", "0% platform commission", "Real-time chat"];

export default function Landing() {
  const router = useRouter();
  const { isAuthenticated, isLoading, isProfileComplete } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace(isProfileComplete ? "/feed" : "/complete-profile");
    }
  }, [isLoading, isAuthenticated, isProfileComplete, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)" }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text-primary)", overflowX: "hidden" }}>
      <header style={{ position: "relative", zIndex: 10, borderBottom: "1px solid var(--color-border)", background: "var(--color-bg)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 800, letterSpacing: 0 }}>
            Uni<span style={{ color: "var(--color-text-secondary)" }}>Sale</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/explore" className="btn btn-ghost btn-sm">Browse</Link>
            <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Get Started <FiArrowRight />
            </Link>
          </div>
        </div>
      </header>

      <section style={{ position: "relative", zIndex: 1, padding: "92px 24px 72px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }} className="animate-fade-in">
          <div className="badge badge-primary" style={{ marginBottom: 24, padding: "7px 14px", fontSize: 13, gap: 8 }}>
            <FiMapPin style={{ fontSize: 14 }} />
            India's first verified campus marketplace
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 22, letterSpacing: 0 }}>
            Buy, sell and trade<br />
            <span className="text-highlight">right on campus</span>
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 36px" }}>
            UniSale verifies every student with their college email, so you always know who you are trading with.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Start selling for free <FiArrowRight />
            </Link>
            <Link href="/explore" className="btn btn-secondary btn-lg">
              Browse listings
            </Link>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center", marginTop: 34 }}>
            {TRUST_ITEMS.map((text) => (
              <span key={text} style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <FiCheckCircle style={{ color: "var(--color-success)", fontSize: 14 }} />
                {text}
              </span>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "64px auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, position: "relative" }}>
          {FEATURED_LISTINGS.map((item, index) => (
            <div
              key={item.title}
              className="card card-interactive animate-fade-scale"
              style={{ overflow: "hidden", animationDelay: `${index * 0.1}s` }}
            >
              <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--color-surface-2)" }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)", marginBottom: 4 }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                      <FiMapPin style={{ fontSize: 12 }} />
                      {item.college}
                    </p>
                  </div>
                  <span className="badge badge-muted" style={{ fontSize: 11, flexShrink: 0 }}>{item.condition}</span>
                </div>
                <span style={{ fontSize: 19, fontWeight: 800, color: "var(--color-text-primary)" }}>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 1, padding: "28px 24px 54px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1, background: "var(--color-border)", borderRadius: 8, overflow: "hidden", border: "1px solid var(--color-border)" }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ background: "var(--color-surface)", padding: "30px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 30, fontWeight: 800, color: "var(--color-text-primary)" }}>{value}</p>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 6 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 1, padding: "64px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, marginBottom: 12 }}>
              Built for campus life
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 16 }}>
              Every feature is designed around how students actually trade.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card" style={{ padding: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: "var(--color-surface-2)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon style={{ fontSize: 22, color: "var(--color-text-primary)" }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.7 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 1, padding: "28px 24px 72px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(22px, 3vw, 30px)" }}>
              Popular categories
            </h2>
            <Link href="/explore" style={{ color: "var(--color-text-primary)", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
              View all <FiArrowRight />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            {CATEGORIES.map(({ icon: Icon, name, count }) => (
              <Link
                key={name}
                href={`/explore?category=${encodeURIComponent(name)}`}
                className="card card-interactive"
                style={{ padding: "20px 16px", display: "block" }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--color-surface-2)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon style={{ fontSize: 20, color: "var(--color-text-primary)" }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{name}</p>
                <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 1, padding: "28px 24px 72px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map((i) => <FiStar key={i} style={{ color: "var(--color-warning)", fill: "none" }} />)}
            </div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(22px, 3vw, 32px)" }}>
              What students say
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map(({ name, college, dept, avatar, text }) => (
              <div key={name} className="card" style={{ padding: 24 }}>
                <p style={{ color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
                  &ldquo;{text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "var(--color-surface-3)",
                    border: "1px solid var(--color-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", flexShrink: 0,
                  }}>
                    {avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{name}</p>
                    <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{dept} - {college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 1, padding: "28px 24px 72px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(22px, 3vw, 32px)" }}>
              Up and running in 3 steps
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { step: "01", title: "Verify your college email", desc: "Register with your .ac.in or .edu email. We send a 6-digit OTP to confirm your student identity." },
              { step: "02", title: "Complete your campus profile", desc: "Add your college, department, and year. This helps buyers trust your listings and makes your feed relevant." },
              { step: "03", title: "Start buying and selling", desc: "Browse listings from your campus, message sellers in real time, and list your own items in under a minute." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="card" style={{ padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{
                  fontSize: 32, fontWeight: 800,
                  color: "var(--color-text-muted)", lineHeight: 1, flexShrink: 0, minWidth: 52,
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

      <section style={{ position: "relative", zIndex: 1, padding: "8px 24px 88px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="card" style={{ padding: "56px 40px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
              {["IIT Bombay", "BITS Pilani", "NIT Trichy", "VIT"].map((college) => (
                <span key={college} className="badge badge-muted" style={{ fontSize: 11 }}>{college}</span>
              ))}
            </div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(24px, 4vw, 36px)", marginBottom: 12 }}>
              Join your campus marketplace
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: 32, maxWidth: 460, margin: "0 auto 32px" }}>
              Sign up free. Verify in 30 seconds. Browse listings from students at your college right now.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Create free account <FiArrowRight />
              </Link>
              <Link href="/explore" className="btn btn-secondary btn-lg">
                Browse without signing up
              </Link>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
              {["No listing fees", "No middlemen", "Instant chat"].map((text) => (
                <span key={text} style={{ fontSize: 13, color: "var(--color-text-muted)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <FiCheckCircle style={{ color: "var(--color-success)", fontSize: 14 }} /> {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid var(--color-border)", padding: "32px 24px" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 800 }}>
            Uni<span style={{ color: "var(--color-text-secondary)" }}>Sale</span>
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/explore" style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Explore</Link>
            <Link href="/register" style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Sign up</Link>
            <Link href="/login" style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Login</Link>
          </div>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
            (c) {new Date().getFullYear()} UniSale - Made for campus communities
          </p>
        </div>
      </footer>
    </div>
  );
}
