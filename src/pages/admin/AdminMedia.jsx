import React, { useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAdminData, useToast } from "../../context/AppContext.jsx";
import { FaPlusCircle, FaTrash } from "../../components/Icons.jsx";

export default function AdminMedia() {
  const { mediaLibrary, setMediaLibrary } = useAdminData();
  const { push } = useToast();
  const [url, setUrl] = useState("");

  const add = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setMediaLibrary((prev) => [{ id: Date.now(), url: url.trim() }, ...prev]);
    setUrl("");
    push("Image added to library.", "success");
  };

  const remove = (id) => setMediaLibrary((prev) => prev.filter((m) => m.id !== id));

  const copy = async (u) => {
    try {
      await navigator.clipboard.writeText(u);
      push("Image URL copied.", "success");
    } catch {
      push("Could not copy. Please copy manually.", "error");
    }
  };

  return (
    <AdminLayout title="Media Library">
      <p style={{ color: "var(--ink-soft)", marginBottom: 20, maxWidth: 640 }}>
        Since this build has no file-storage backend, add image URLs here to keep a reusable library. Copy any
        URL into a product or article image field.
      </p>
      <form onSubmit={add} className="flex gap-8" style={{ marginBottom: 24, maxWidth: 640 }}>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://images.example.com/photo.jpg" style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: "1px solid var(--line)" }} />
        <button className="btn btn-primary"><FaPlusCircle /> Add</button>
      </form>

      {mediaLibrary.length === 0 ? (
        <div className="empty-state"><div className="icon">🖼️</div><h3>No images added yet</h3><p>Paste an image URL above to start your library.</p></div>
      ) : (
        <div className="product-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
          {mediaLibrary.map((m) => (
            <div className="card" key={m.id} style={{ overflow: "hidden" }}>
              <div style={{ aspectRatio: "1/1" }}><img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ padding: 10, display: "flex", gap: 6 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => copy(m.url)}>Copy URL</button>
                <button className="icon-btn" onClick={() => remove(m.id)} aria-label="Remove image"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
