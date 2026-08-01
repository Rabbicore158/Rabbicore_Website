import React from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAdminData, useToast } from "../../context/AppContext.jsx";
import { Link } from "../../utils/router.jsx";
import { FaEye } from "../../components/Icons.jsx";

export default function AdminHomepageBuilder() {
  const { homeSections, setHomeSections } = useAdminData();
  const { push } = useToast();

  const toggle = (key) => {
    setHomeSections((prev) => prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)));
    push("Homepage updated.", "success");
  };

  return (
    <AdminLayout title="Homepage Builder">
      <p style={{ color: "var(--ink-soft)", marginBottom: 20, maxWidth: 640 }}>
        Show or hide sections on your homepage. Changes apply immediately.
        <Link to="/" style={{ color: "var(--terracotta)", fontWeight: 600 }}> <FaEye size={12} /> view the live homepage</Link>.
      </p>
      <div className="admin-card">
        {homeSections.map((s) => (
          <div key={s.key} className="flex items-center" style={{ justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
            <span style={{ fontWeight: 600 }}>{s.label}</span>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={s.visible} onChange={() => toggle(s.key)} style={{ width: 18, height: 18, accentColor: "var(--terracotta)" }} />
              {s.visible ? "Visible" : "Hidden"}
            </label>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
