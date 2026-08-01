import React, { useMemo } from "react";
import { Link, useSearchParams } from "../utils/router.jsx";
import { collections as baseCollections } from "../data/site.js";
import { useAllProducts } from "../data/useCatalog.js";
import { ProductCard } from "../components/Cards.jsx";
import { Breadcrumbs } from "../components/Sections.jsx";
import Reveal from "../components/Reveal.jsx";
import { useAdminData } from "../context/AppContext.jsx";

function useCollections() {
  const ctx = useAdminData();
  return useMemo(() => {
    const overrides = ctx?.collectionOverrides || {};
    return baseCollections.map((c) => ({ ...c, ...(overrides[c.key] || {}) }));
  }, [ctx]);
}

function pickForCollection(products, key) {
  const rnd = (seed) => {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  };
  const r = rnd(key.length * 17 + 3);
  switch (key) {
    case "new-arrivals": return products.filter((p) => p.isNew);
    case "best-sellers": return [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 16);
    case "on-sale": return products.filter((p) => p.onSale);
    case "scandinavian-edit": return products.filter((p) => p.specs.Style === "Scandinavian" || p.specs.Style === "Minimalist");
    case "boho-living": return products.filter((p) => p.specs.Style === "Boho" || p.specs.Material === "Rattan & Wicker");
    case "small-space-edit": return [...products].sort(() => r() - 0.5).slice(0, 16);
    default: return products;
  }
}

export default function Collections() {
  const [params] = useSearchParams();
  const activeKey = params.get("c");
  const products = useAllProducts();
  const collections = useCollections();

  if (activeKey) {
    const col = collections.find((c) => c.key === activeKey);
    const items = pickForCollection(products, activeKey);
    return (
      <div className="page-fade section">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Collections", to: "/collections" }, { label: col?.name || "Collection" }]} />
          <h1 className="section-title">{col?.name || "Collection"}</h1>
          <p className="section-sub">{col?.desc}</p>
          <div className="product-grid" style={{ marginTop: 28 }}>
            {items.length ? items.map((p) => <ProductCard key={p.id} product={p} />) : (
              <div className="empty-state"><h3>No products in this collection yet</h3></div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Collections" }]} />
        <h1 className="section-title">Shop Our Collections</h1>
        <p className="section-sub">Thoughtfully grouped picks to help you shop a look, not just a category.</p>
        <div className="product-grid" style={{ marginTop: 28, gridTemplateColumns: "repeat(3, 1fr)" }}>
          {collections.map((c, i) => (
            <Reveal delay={i * 60} key={c.key}>
              <Link to={`/collections?c=${c.key}`} className="card" style={{ display: "block" }}>
                <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                  <img src={c.image} alt={c.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="product-info">
                  <div className="product-name" style={{ fontSize: 18, fontFamily: "var(--font-display)" }}>{c.name}</div>
                  <p style={{ color: "var(--ink-soft)", fontSize: 13.5, marginTop: 6 }}>{c.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
