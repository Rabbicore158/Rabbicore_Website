import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAllArticles } from "../../data/useCatalog.js";
import { useAdminData, useToast } from "../../context/AppContext.jsx";
import { useSearchParams } from "../../utils/router.jsx";
import RichTextEditor from "../../components/RichTextEditor.jsx";
import { FaPlusCircle, FaEdit, FaTrash, FaTimes } from "../../components/Icons.jsx";

const CATS = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Dining Room", "Office", "Outdoor", "Lighting"];
const emptyForm = { title: "", category: "Living Room", excerpt: "", author: "RabbiCore Team", heroImage: "", contentHtml: "<p>Start writing your article...</p>" };

export default function AdminArticles() {
  const articles = useAllArticles();
  const { extraArticles, setExtraArticles, deletedArticleIds, setDeletedArticleIds } = useAdminData();
  const { push } = useToast();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (params.get("new") === "1") { setForm(emptyForm); setModal("new"); setParams({}); }
    // eslint-disable-next-line
  }, []);

  const filtered = articles.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));
  const isCms = (a) => extraArticles.some((e) => e.id === a.id);

  const openEdit = (a) => {
    setForm({
      title: a.title, category: a.category, excerpt: a.excerpt, author: a.author,
      heroImage: a.heroImage, contentHtml: a.isHtml ? a.contentHtml : `<p>${a.content.replace(/\n\n/g, "</p><p>")}</p>`,
    });
    setModal(a);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { push("Title is required.", "error"); return; }
    const isEditing = modal && modal !== "new";
    const id = isEditing ? modal.id : Date.now();
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + id;
    const now = new Date();
    const articleObj = {
      id, slug, title: form.title, category: form.category,
      excerpt: form.excerpt || form.title,
      author: form.author || "RabbiCore Team",
      date: now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      dateISO: now.toISOString(),
      readTime: `${Math.max(3, Math.round(form.contentHtml.split(" ").length / 200))} min read`,
      heroImage: form.heroImage || "/images/misc/article-generic.webp",
      toc: [],
      isHtml: true,
      contentHtml: form.contentHtml,
    };

    if (isEditing) {
      setExtraArticles((prev) => {
        const exists = prev.some((a) => a.id === id);
        return exists ? prev.map((a) => (a.id === id ? articleObj : a)) : [articleObj, ...prev];
      });
      if (!isCms(modal)) setDeletedArticleIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      push("Article updated.", "success");
    } else {
      setExtraArticles((prev) => [articleObj, ...prev]);
      push("Article published.", "success");
    }
    setModal(null);
  };

  const remove = (a) => {
    if (!window.confirm(`Delete "${a.title}"?`)) return;
    if (isCms(a)) setExtraArticles((prev) => prev.filter((e) => e.id !== a.id));
    else setDeletedArticleIds((prev) => [...prev, a.id]);
    push("Article deleted.", "success");
  };

  return (
    <AdminLayout title="Articles">
      <div className="admin-topbar" style={{ marginBottom: 18 }}>
        <input placeholder="Search articles..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid var(--line)", minWidth: 240 }} />
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setModal("new"); }}><FaPlusCircle /> Add Article</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td><img src={a.heroImage} alt="" style={{ width: 50, height: 36, borderRadius: 6, objectFit: "cover" }} /></td>
                <td style={{ maxWidth: 260 }}>{a.title}</td>
                <td>{a.category}</td>
                <td>{a.author}</td>
                <td>{a.date}</td>
                <td>
                  <div className="flex gap-8">
                    <button className="icon-btn" onClick={() => openEdit(a)} aria-label={`Edit ${a.title}`}><FaEdit /></button>
                    <button className="icon-btn" onClick={() => remove(a)} aria-label={`Delete ${a.title}`}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="mobile-drawer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="backdrop" onClick={() => setModal(null)} />
          <form className="form-card" onSubmit={save} style={{ position: "relative", width: "min(720px, 94vw)", maxHeight: "88vh", overflowY: "auto" }}>
            <button type="button" className="icon-btn" style={{ position: "absolute", top: 16, right: 16 }} onClick={() => setModal(null)} aria-label="Close"><FaTimes /></button>
            <h3 style={{ marginBottom: 18 }}>{modal === "new" ? "Add Article" : "Edit Article"}</h3>
            <div className="form-field"><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="grid-2">
              <div className="form-field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field"><label>Author</label><input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
            </div>
            <div className="form-field"><label>Hero Image URL</label><input value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} placeholder="https://..." /></div>
            <div className="form-field"><label>Excerpt</label><textarea rows="2" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div className="form-field">
              <label>Content</label>
              <RichTextEditor value={form.contentHtml} onChange={(html) => setForm((f) => ({ ...f, contentHtml: html }))} />
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 8 }}>{modal === "new" ? "Publish Article" : "Save Changes"}</button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
