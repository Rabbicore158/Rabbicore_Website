import React from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AppContext.jsx";
import { FaUserShield } from "../../components/Icons.jsx";

export default function AdminProfile() {
  const { session } = useAuth();
  const isSuper = session?.role === "superadmin";

  return (
    <AdminLayout title="Profile">
      <div className="admin-card" style={{ maxWidth: 480 }}>
        <div className="flex items-center gap-8" style={{ marginBottom: 20 }}>
          <span className="admin-avatar lg">{session?.avatar || "🙂"}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{session?.label}</div>
            <div style={{ color: "var(--ink-soft)", fontSize: 13.5, textTransform: "capitalize" }}>{session?.role}</div>
          </div>
        </div>
        {!isSuper && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--line)" }}>
            <span style={{ color: "var(--ink-soft)" }}>Username</span><strong>{session?.username}</strong>
          </div>
        )}
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 16 }}>
          Demo accounts are hardcoded for this build, so password changes aren't supported here.
          Connect a real authentication backend to manage credentials securely.
        </p>
      </div>
    </AdminLayout>
  );
}
