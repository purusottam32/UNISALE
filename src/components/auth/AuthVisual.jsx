/**
 * Right-side visual panel for auth pages.
 * Shows animated brand visuals, a tagline, and stats.
 */
export default function AuthVisual({ tagline, stats = [] }) {
  return (
    <div className="auth-visual">
      <div className="mesh-bg" />

      {/* Floating cards illustration */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {/* Decorative listing cards */}
        <div style={{
          position: "absolute",
          top: "15%", left: "50%",
          transform: "translateX(-50%) rotate(-6deg)",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          padding: "16px 20px",
          width: 220,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          animation: "fadeIn 0.8s ease forwards",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💻</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>MacBook Air M2</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Like New</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-primary)" }}>₹65,000</span>
            <span className="badge badge-success" style={{ fontSize: 11 }}>✓ Verified</span>
          </div>
        </div>

        <div style={{
          position: "absolute",
          top: "35%", left: "52%",
          transform: "translateX(-50%) rotate(4deg)",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          padding: "16px 20px",
          width: 200,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          animation: "fadeIn 1s 0.2s ease forwards",
          opacity: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(249,112,102,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📚</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>Data Structures</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>3rd Edition</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-accent)" }}>₹380</span>
            <span className="badge badge-muted" style={{ fontSize: 11 }}>IIT Bombay</span>
          </div>
        </div>

        <div style={{
          position: "absolute",
          top: "54%", left: "48%",
          transform: "translateX(-50%) rotate(-3deg)",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          padding: "16px 20px",
          width: 210,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          animation: "fadeIn 1.2s 0.4s ease forwards",
          opacity: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(52,211,153,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🚲</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>Hero Cycle</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Good Condition</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-success)" }}>₹2,200</span>
            <span className="badge badge-primary" style={{ fontSize: 11 }}>On-Campus</span>
          </div>
        </div>
      </div>

      {/* Bottom content */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 40 }}>
        <div className="glass" style={{ borderRadius: 20, padding: 28 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 20, lineHeight: 1.4 }}>
            &ldquo;{tagline}&rdquo;
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-primary)" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
