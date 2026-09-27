"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/shared/context/AuthContext";
import { useSchoolBrand } from "@/shared/context/SchoolBrandContext";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px",
  background: "#fff",
  border: "1px solid var(--border)",
  borderRadius: "12px", fontSize: "14px", color: "var(--foreground)",
  outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 600,
  color: "var(--muted-foreground)", marginBottom: "6px",
  textTransform: "uppercase", letterSpacing: "0.06em",
};

export function AdminLoginPage() {
  const { login } = useAuth();
  const { schoolName, accentColor, logoUrl } = useSchoolBrand();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message ?? "Invalid email or password.");
      } else if (err.code === "ECONNABORTED") {
        setError("The server took too long to respond. Please try again in a moment.");
      } else {
        setError("Couldn't reach the server. Check your connection and try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="school-site grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: "100vh", background: "var(--muted)" }}>
      {/* Left — dark panel, matching the homepage hero's visual language */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-14" style={{ backgroundColor: "var(--foreground)" }}>
        <div
          className="absolute top-0 right-0 w-80 h-80 opacity-[0.12] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: accentColor }}
        />

        <div className="relative flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={schoolName} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: accentColor, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "16px",
            }}>
              {schoolName[0]}
            </div>
          )}
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Admin Portal
          </span>
        </div>

        <div className="relative">
          <h1 className="font-display font-black" style={{ color: "#fff", fontSize: "44px", lineHeight: 1.1 }}>
            {schoolName}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", marginTop: "16px", maxWidth: "380px", lineHeight: 1.6 }}>
            Sign in to manage announcements, staff, admissions, and everything behind the scenes.
          </p>
        </div>

        {/* Floating badge — echoes the "years of legacy" chip on the homepage collage */}
        <div className="relative inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-5 py-4 self-start">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: accentColor }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "13px" }}>{schoolName[0]}</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>Trusted school management, built in.</span>
        </div>
      </div>

      {/* Right — form floating in its own card, matching the site's rounded-card language */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div style={{ width: "100%", maxWidth: "400px" }}>
          {/* Mobile-only header (dark panel hidden below lg) */}
          <div className="lg:hidden" style={{ textAlign: "center", marginBottom: "28px" }}>
            {logoUrl ? (
              <img src={logoUrl} alt={schoolName} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px" }} />
            ) : (
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: accentColor, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", fontWeight: 800, fontSize: "18px",
              }}>
                {schoolName[0]}
              </div>
            )}
            <h1 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
              {schoolName}
            </h1>
          </div>

          <div className="bg-card rounded-[28px] p-8 sm:p-10 shadow-sm border border-border">
            <div style={{ marginBottom: "28px" }}>
              <h2 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
                Welcome back
              </h2>
              <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Sign in with your admin account</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com" required style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password" required style={{ ...inputStyle, paddingRight: "42px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", padding: 0, display: "flex",
                      color: "var(--muted-foreground)", cursor: "pointer",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  padding: "10px 14px", background: "rgba(193,52,46,0.08)",
                  border: "1px solid rgba(193,52,46,0.25)", borderRadius: "10px",
                  fontSize: "13px", color: "#b3261e",
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "13px", marginTop: "4px",
                  background: accentColor, border: "none", borderRadius: "999px",
                  fontSize: "14px", fontWeight: 700, color: "#fff",
                  cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px" }}>
            <a href="/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>← Back to the website</a>
          </p>
        </div>
      </div>
    </div>
  );
}
