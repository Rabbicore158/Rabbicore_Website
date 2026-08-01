import React, { useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { collections as baseCollections } from "../../data/site.js";
import { useAdminData, useToast } from "../../context/AppContext.jsx";
import { FaEdit, FaTimes } from "../../components/Icons.jsx";

export default function AdminCollections() {
  const { collectionOverrides, setCollectionOverrides } = useAdminData();
  const { push } = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", desc: "", image: "" });

  const merged = baseCollections.map((c) => ({ ...c, ...(collectionOverrides[c.key] || {}) }));

  const openEdit = (c) => { setForm({ name: c.name, desc: c.desc, image: c.image }); setModal(c.key); };

  const save = (e) => {
    e.preventDefault();
    setCollectionOverrides((prev) => ({ ...prev, [modal]: { ...form } }));
    push("Collection updated.", "success");
    setModal(null);
  };

  return (
    <AdminLayout title="Collections">
      <p style={{ color: "var(--ink-soft)", marginBottom: 20, maxWidth: 600 }}>
        Edit the name, description, and banner image shown for each featured collection across the site.
      </p>
      <div className="product-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {merged.map((c) => (
          <div className="card" key={c.key}>
            <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
              <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="product-info">
              <div className="product-name">{c.name}</div>
              <p style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: 6 }}>{c.desc}</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => openEdit(c)}><FaEdit /> Edit</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="mobile-drawer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="backdrop" onClick={() => setModal(null)} />
          <form className="form-card" onSubmit={save} style={{ position: "relative", width: "min(480px, 92vw)" }}>
            <button type="button" className="icon-btn" style={{ position: "absolute", top: 16, right: 16 }} onClick={() => setModal(null)} aria-label="Close"><FaTimes /></button>
            <h3 style={{ marginBottom: 18 }}>Edit Collection</h3>
            <div className="form-field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-field"><label>Description</label><textarea rows="3" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></div>
            <div className="form-field"><label>Image URL</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
            <button className="btn btn-primary btn-block">Save Changes</button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
