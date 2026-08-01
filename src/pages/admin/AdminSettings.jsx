import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAdminData, useToast } from "../../context/AppContext.jsx";

export default function AdminSettings() {
  const { settings, setSettings } = useAdminData();
  const { push } = useToast();
  const [form, setForm] = useState(settings);

  useEffect(() => setForm(settings), [settings]);

  const save = (e) => {
    e.preventDefault();
    setSettings(form);
    push("Settings saved.", "success");
  };

  return (
    <AdminLayout title="Settings">
      <form className="form-card" onSubmit={save} style={{ maxWidth: 560 }}>
        <div className="form-field"><label>Site Name</label><input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} /></div>
        <div className="form-field"><label>Tagline</label><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
        <div className="form-field"><label>Contact Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="form-field"><label>Contact Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div className="form-field"><label>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">Save Settings</button>
      </form>
    </AdminLayout>
  );
}
