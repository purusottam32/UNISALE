import Image from "next/image";
import { FiCheckCircle, FiMapPin } from "react-icons/fi";

const MOCK_LISTINGS = [
  {
    title: "MacBook Air M2",
    meta: "Like New",
    price: "Rs. 65,000",
    badge: "Verified",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Data Structures",
    meta: "3rd Edition",
    price: "Rs. 380",
    badge: "IIT Bombay",
    image: "https://images.unsplash.com/photo-1544652478-665375a24532?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Hero Cycle",
    meta: "Good Condition",
    price: "Rs. 2,200",
    badge: "On campus",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80",
  },
];

export default function AuthVisual({ tagline, stats = [] }) {
  return (
    <div className="auth-visual">
      <div style={{ width: "100%", maxWidth: 420, padding: 40 }}>
        <div style={{ display: "grid", gap: 14 }}>
          {MOCK_LISTINGS.map((item) => (
            <div
              key={item.title}
              className="card"
              style={{ padding: 14, display: "grid", gridTemplateColumns: "72px 1fr", gap: 14, alignItems: "center" }}
            >
              <div style={{ position: "relative", width: 72, height: 72, borderRadius: 8, overflow: "hidden", background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)" }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{item.meta}</div>
                  </div>
                  <span className="badge badge-muted" style={{ fontSize: 10 }}>{item.badge}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-text-primary)" }}>{item.price}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-text-muted)" }}>
                    <FiMapPin style={{ fontSize: 12 }} />
                    Campus
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 18, padding: 28 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 20, lineHeight: 1.4 }}>
            &ldquo;{tagline}&rdquo;
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 800, color: "var(--color-text-primary)" }}>
                  <FiCheckCircle style={{ color: "var(--color-success)", fontSize: 14, flexShrink: 0 }} />
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>{stat.label}</div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
