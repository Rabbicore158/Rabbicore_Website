import React, { useState, useEffect } from "react";
import { useRouter } from "../../utils/router.jsx";
import { useAuth } from "../../context/AppContext.jsx";
import { FaUserShield, FaArrowLeft } from "../../components/Icons.jsx";

export default function AdminLogin() {
  const { session, login } = useAuth();
  const { navigate } = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate("/admin/dashboard", { replace: true });
  }, [session]);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(username.trim(), password);
      setLoading(false);
      if (result.ok) navigate("/admin/dashboard");
      else setError(result.error);
    }, 400);
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate("/")} style={{ marginBottom: 18 }}>
          <FaArrowLeft size={12} /> Back to Site
        </button>
        <div className="text-center" style={{ marginBottom: 24 }}>
          <span className="icon-btn" style={{ width: 56, height: 56, fontSize: 22, background: "var(--terracotta)", color: "white", margin: "0 auto 14px" }}>
            <FaUserShield />
          </span>
          <h1 style={{ fontSize: 24 }}>Admin Login</h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 6 }}>Sign in to manage RabbiCore</p>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="form-field">
            <label htmlFor="u">Username</label>
            <input id="u" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          </div>
          <div className="form-field">
            <label htmlFor="p">Password</label>
            <input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </div>
          {error && <div className="error" style={{ marginBottom: 14 }}>{error}</div>}
          <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
      </div>
    </div>
  );
}
