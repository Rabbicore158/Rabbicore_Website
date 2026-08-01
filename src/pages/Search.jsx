import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "../utils/router.jsx";
import { useAllProducts, useAllArticles } from "../data/useCatalog.js";
import { ProductCard } from "../components/Cards.jsx";
import { ArticleCard } from "../components/Cards.jsx";
import { Breadcrumbs } from "../components/Sections.jsx";
import { FaSearch, FaTimes } from "../components/Icons.jsx";

function useRecentSearches() {
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rc_recent_search") || "[]"); } catch { return []; }
  });
  const add = (term) => {
    setRecent((prev) => {
      const next = [term, ...prev.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 6);
      localStorage.setItem("rc_recent_search", JSON.stringify(next));
      return next;
    });
  };
  const clear = () => { setRecent([]); localStorage.removeItem("rc_recent_search"); };
  return [recent, add, clear];
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);
  const products = useAllProducts();
  const articles = useAllArticles();
  const [recent, addRecent, clearRecent] = useRecentSearches();

  useEffect(() => setInput(q), [q]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (input !== q) setParams({ q: input });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [input]);

  useEffect(() => {
    if (q.trim()) addRecent(q.trim());
    // eslint-disable-next-line
  }, [q]);

  const term = q.trim().toLowerCase();
  const productResults = term ? products.filter((p) => p.name.toLowerCase().includes(term) || p.categoryName.toLowerCase().includes(term) || p.specs.Style.toLowerCase().includes(term)) : [];
  const articleResults = term ? articles.filter((a) => a.title.toLowerCase().includes(term) || a.category.toLowerCase().includes(term)) : [];

  const suggestions = ["Sofa", "Rattan Chair", "Bedroom", "Wall Art", "Pendant Light", "Outdoor"];

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Search" }]} />
        <h1 className="section-title">Search</h1>

        <div style={{ maxWidth: 560, margin: "22px 0 36px", position: "relative" }}>
          <FaSearch style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--ink-soft)" }} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search products, articles, rooms..."
            style={{ width: "100%", padding: "16px 44px", borderRadius: 999, border: "1.5px solid var(--line)", fontSize: 16 }}
          />
          {input && (
            <button className="icon-btn" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)" }} onClick={() => { setInput(""); setParams({}); }} aria-label="Clear search">
              <FaTimes />
            </button>
          )}
        </div>

        {!term && (
          <div>
            {recent.length > 0 && (
              <div style={{ marginBottom: 30 }}>
                <div className="flex items-center" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                  <h4 style={{ fontSize: 15 }}>Recent Searches</h4>
                  <button className="btn-ghost" onClick={clearRecent}>Clear</button>
                </div>
                <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
                  {recent.map((r) => (
                    <button key={r} className="btn btn-outline btn-sm" onClick={() => setParams({ q: r })}>{r}</button>
                  ))}
                </div>
              </div>
            )}
            <h4 style={{ fontSize: 15, marginBottom: 10 }}>Popular Searches</h4>
            <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
              {suggestions.map((s) => (
                <button key={s} className="btn btn-outline btn-sm" onClick={() => setParams({ q: s })}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {term && productResults.length === 0 && articleResults.length === 0 && (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No results for "{q}"</h3>
            <p>Try a different search term, or browse a category instead.</p>
            <div className="flex gap-8" style={{ justifyContent: "center", flexWrap: "wrap" }}>
              {suggestions.slice(0, 4).map((s) => (
                <button key={s} className="btn btn-outline btn-sm" onClick={() => setParams({ q: s })}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {term && productResults.length > 0 && (
          <div style={{ marginBottom: 44 }}>
            <h3 style={{ marginBottom: 18 }}>{productResults.length} Products</h3>
            <div className="product-grid">
              {productResults.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {term && articleResults.length > 0 && (
          <div>
            <h3 style={{ marginBottom: 18 }}>{articleResults.length} Articles</h3>
            <div className="article-grid">
              {articleResults.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
