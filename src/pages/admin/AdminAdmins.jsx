import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth, useToast } from "../../context/AppContext.jsx";
import { adminAccounts, avatarPool } from "../../data/site.js";
import { useRouter } from "../../utils/router.jsx";
import { FaPlusCircle, FaTrash, FaTimes } from "../../components/Icons.jsx";

export default function AdminAdmins() {
  const { session, extraAdmins, setExtraAdmins } = useAuth();
  const { navigate } = useRouter();
  const { push } = useToast();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", label: "" });

  useEffect(() => {
    if (session && session.role !== "superadmin") navigate("/admin/dashboard", { replace: true });
  }, [session]);

  if (!session || session.role !== "superadmin") return null;

  // Never render the hardcoded superadmin account in any list.
  const visibleFixedAdmins = adminAccounts.filter((a) => a.role !== "superadmin");

  const addAdmin = (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) { push("Username and password are required.", "error"); return; }
    const allUsernames = [...adminAccounts, ...extraAdmins].map((a) => a.username.toLowerCase());
    if (allUsernames.includes(form.username.trim().toLowerCase())) { push("That username already exists.", "error"); return; }
    let hash = 0;
    for (let i = 0; i < form.username.length; i++) hash = (hash * 31 + form.username.charCodeAt(i)) >>> 0;
    const avatar = avatarPool[hash % avatarPool.length];
    setExtraAdmins((prev) => [...prev, { username: form.username.trim(), password: form.password, role: "admin", label: form.label.trim() || form.username.trim(), avatar }]);
    push("Admin added.", "success");
    setForm({ username: "", password: "", label: "" });
    setModal(false);
  };

  const removeAdmin = (username) => {
    if (!window.confirm(`Remove admin "${username}"?`)) return;
    setExtraAdmins((prev) => prev.filter((a) => a.username !== username));
    push("Admin removed.", "success");
  };

  return (
    <AdminLayout title="Manage Admins">
      <p style={{ color: "var(--ink-soft)", marginBottom: 20, maxWidth: 620 }}>
        As Super Admin, you can view and manage standard admin accounts, and add new ones.
      </p>
      <button className="btn btn-primary" style={{ marginBottom: 18 }} onClick={() => setModal(true)}><FaPlusCircle /> Add Admin</button>

      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th>Avatar</th><th>Label</th><th>Username</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {visibleFixedAdmins.map((a) => (
            <tr key={a.username}>
              <td><span className="admin-avatar">{a.avatar || "🙂"}</span></td>
              <td>{a.label}</td><td>{a.username}</td><td>Admin (built-in)</td>
              <td style={{ color: "var(--ink-soft)", fontSize: 13 }}>Fixed account</td>
            </tr>
          ))}
          {extraAdmins.map((a) => (
            <tr key={a.username}>
              <td><span className="admin-avatar">{a.avatar || "🙂"}</span></td>
              <td>{a.label}</td><td>{a.username}</td><td>Admin</td>
              <td><button className="icon-btn" onClick={() => removeAdmin(a.username)} aria-label={`Remove ${a.username}`}><FaTrash /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {modal && (
        <div className="mobile-drawer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="backdrop" onClick={() => setModal(false)} />
          <form className="form-card" onSubmit={addAdmin} style={{ position: "relative", width: "min(440px, 92vw)" }}>
            <button type="button" className="icon-btn" style={{ position: "absolute", top: 16, right: 16 }} onClick={() => setModal(false)} aria-label="Close"><FaTimes /></button>
            <h3 style={{ marginBottom: 18 }}>Add Admin</h3>
            <div className="form-field"><label>Display Label</label><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Admin 06" /></div>
            <div className="form-field"><label>Username</label><input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></div>
            <div className="form-field"><label>Password</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
            <button className="btn btn-primary btn-block">Add Admin</button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
