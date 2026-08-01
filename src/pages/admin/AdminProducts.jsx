import React, { useState, useMemo, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAllProducts } from "../../data/useCatalog.js";
import { useAdminData, useToast } from "../../context/AppContext.jsx";
import { categories } from "../../data/site.js";
import { useSearchParams } from "../../utils/router.jsx";
import { FaPlusCircle, FaEdit, FaTrash, FaTimes } from "../../components/Icons.jsx";

const emptyForm = {
  name: "", category: "living-room", price: "", image: "",
  description: "", material: "", color: "", dimensions: "",
};

export default function AdminProducts() {
  const products = useAllProducts();
  const { extraProducts, setExtraProducts, deletedProductIds, setDeletedProductIds } = useAdminData();
  const { push } = useToast();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // null | 'new' | product object
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (params.get("new") === "1") { setModal("new"); setForm(emptyForm); setParams({}); }
    // eslint-disable-next-line
  }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const isCmsProduct = (p) => extraProducts.some((e) => e.id === p.id);

  const openEdit = (p) => {
    setForm({
      name: p.name, category: p.category, price: p.price, image: p.images[0],
      description: p.description, material: p.specs.Material, color: p.specs.Color, dimensions: p.specs.Dimensions,
    });
    setModal(p);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) { push("Name and price are required.", "error"); return; }
    const catName = categories.find((c) => c.key === form.category)?.name || "Living Room";
    const isEditing = modal && modal !== "new";
    const id = isEditing ? modal.id : Date.now();
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + id;
    const productObj = {
      id, slug, name: form.name, category: form.category, categoryName: catName,
      price: parseFloat(form.price), originalPrice: null, onSale: false,
      rating: 4.7, reviews: 12, isNew: true, isBestseller: false,
      images: (() => { const img = form.image || `/images/misc/category-${form.category}.png`; return [img, img, img, img]; })(),
      description: form.description || `${form.name}, a beautiful addition to your ${catName.toLowerCase()}.`,
      features: ["Added via Admin Dashboard", "Premium materials", "Fast shipping"],
      specs: { Material: form.material || "N/A", Color: form.color || "N/A", Dimensions: form.dimensions || "N/A", Weight: "N/A", Assembly: "N/A", Style: "Modern" },
      affiliateUrl: `https://www.amazon.com/s?k=${encodeURIComponent(form.name)}`,
    };

    if (isEditing) {
      setExtraProducts((prev) => {
        const exists = prev.some((p) => p.id === id);
        return exists ? prev.map((p) => (p.id === id ? productObj : p)) : [productObj, ...prev];
      });
      if (!isCmsProduct(modal)) {
        setDeletedProductIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      }
      push("Product updated.", "success");
    } else {
      setExtraProducts((prev) => [productObj, ...prev]);
      push("Product added.", "success");
    }
    setModal(null);
  };

  const remove = (p) => {
    if (!window.confirm(`Remove "${p.name}" from the site?`)) return;
    if (isCmsProduct(p)) {
      setExtraProducts((prev) => prev.filter((e) => e.id !== p.id));
    } else {
      setDeletedProductIds((prev) => [...prev, p.id]);
    }
    push("Product removed.", "success");
  };

  return (
    <AdminLayout title="Products">
      <div className="admin-topbar" style={{ marginBottom: 18 }}>
        <input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid var(--line)", minWidth: 240 }}
        />
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setModal("new"); }}>
          <FaPlusCircle /> Add Product
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Rating</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.slice(0, 60).map((p) => (
              <tr key={p.id}>
                <td><img src={p.images[0]} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} /></td>
                <td>{p.name}</td>
                <td>{p.categoryName}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.rating} ★</td>
                <td>
                  <div className="flex gap-8">
                    <button className="icon-btn" onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`}><FaEdit /></button>
                    <button className="icon-btn" onClick={() => remove(p)} aria-label={`Delete ${p.name}`}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 10 }}>
          Showing {Math.min(60, filtered.length)} of {filtered.length} products. Changes are saved to this browser.
        </p>
      </div>

      {modal && (
        <div className="mobile-drawer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="backdrop" onClick={() => setModal(null)} />
          <form className="form-card" onSubmit={save} style={{ position: "relative", width: "min(560px, 92vw)", maxHeight: "88vh", overflowY: "auto" }}>
            <button type="button" className="icon-btn" style={{ position: "absolute", top: 16, right: 16 }} onClick={() => setModal(null)} aria-label="Close"><FaTimes /></button>
            <h3 style={{ marginBottom: 18 }}>{modal === "new" ? "Add Product" : "Edit Product"}</h3>
            <div className="form-field"><label>Product Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="grid-2">
              <div className="form-field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-field"><label>Price (USD)</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
            </div>
            <div className="form-field"><label>Image URL</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
            <div className="form-field"><label>Description</label><textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid-2">
              <div className="form-field"><label>Material</label><input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} /></div>
              <div className="form-field"><label>Color</label><input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
            </div>
            <div className="form-field"><label>Dimensions</label><input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder='e.g. 32"W x 30"D x 34"H' /></div>
            <button className="btn btn-primary btn-block">{modal === "new" ? "Add Product" : "Save Changes"}</button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
