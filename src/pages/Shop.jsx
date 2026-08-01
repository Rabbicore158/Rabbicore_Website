import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "../utils/router.jsx";
import { useAllProducts } from "../data/useCatalog.js";
import { ProductCard, ProductCardSkeleton } from "../components/Cards.jsx";
import { Breadcrumbs } from "../components/Sections.jsx";
import { categories } from "../data/site.js";
import { FaFilter, FaTimes } from "../components/Icons.jsx";

const PAGE_SIZE = 12;

export default function Shop() {
  const products = useAllProducts();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const category = params.get("category") || "";
  const sort = params.get("sort") || "popular";
  const minPrice = Number(params.get("min") || 0);
  const maxPrice = Number(params.get("max") || 1000);
  const page = Number(params.get("page") || 1);
  const onlyNew = params.get("new") === "1";
  const onlySale = params.get("sale") === "1";

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [category, sort, minPrice, maxPrice, page, onlyNew, onlySale]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (category) list = list.filter((p) => p.category === category);
    if (onlyNew) list = list.filter((p) => p.isNew);
    if (onlySale) list = list.filter((p) => p.onSale);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "newest") list = [...list].sort((a, b) => b.id - a.id);
    else list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [products, category, sort, minPrice, maxPrice, onlyNew, onlySale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const update = (patch) => {
    const obj = Object.fromEntries(params.entries());
    Object.assign(obj, patch);
    Object.keys(obj).forEach((k) => (obj[k] === "" || obj[k] == null) && delete obj[k]);
    setParams(obj);
  };

  const catName = categories.find((c) => c.key === category)?.name;
  const clearFilters = () => setParams({});

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shop", to: "/shop" }, ...(catName ? [{ label: catName }] : [])]} />
        <h1 className="section-title">{catName || "All Products"}</h1>
        <p className="section-sub">Discover beautiful pieces to style your space with warmth and character.</p>

        <div className="shop-layout" style={{ marginTop: 28 }}>
          <FilterPanel
            category={category} sort={sort} minPrice={minPrice} maxPrice={maxPrice}
            onlyNew={onlyNew} onlySale={onlySale} update={update} clearFilters={clearFilters}
            mobileOpen={mobileFiltersOpen} setMobileOpen={setMobileFiltersOpen}
          />

          <div>
            <div className="toolbar">
              <span style={{ color: "var(--ink-soft)", fontSize: 14 }}>{filtered.length} products</span>
              <select className="select" value={sort} onChange={(e) => update({ sort: e.target.value, page: 1 })} aria-label="Sort by">
                <option value="popular">Sort: Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <button className="btn btn-outline btn-sm mobile-only-filter" onClick={() => setMobileFiltersOpen(true)} style={{ marginBottom: 16 }}>
              <FaFilter /> Filters
            </button>

            {loading ? (
              <div className="product-grid">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : paged.length > 0 ? (
              <div className="product-grid">
                {paged.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>No products match your filters</h3>
                <p>Try adjusting your filters or browse a different category.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={pageSafe === 1} onClick={() => update({ page: pageSafe - 1 })} aria-label="Previous page">‹</button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} className={`page-btn ${pageSafe === i + 1 ? "active" : ""}`} onClick={() => update({ page: i + 1 })}>{i + 1}</button>
                ))}
                <button className="page-btn" disabled={pageSafe === totalPages} onClick={() => update({ page: pageSafe + 1 })} aria-label="Next page">›</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ category, sort, minPrice, maxPrice, onlyNew, onlySale, update, clearFilters, mobileOpen, setMobileOpen }) {
  const body = (
    <div className="filters-panel">
      <div className="flex items-center" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <h5 style={{ margin: 0, fontSize: 16, fontFamily: "var(--font-display)" }}>Filters</h5>
        <button className="btn-ghost" onClick={clearFilters} style={{ fontSize: 13 }}>Clear</button>
      </div>
      <div className="filter-group">
        <h5>Category</h5>
        <label className="filter-row">
          <input type="radio" name="cat" checked={!category} onChange={() => update({ category: "", page: 1 })} /> All Categories
        </label>
        {categories.map((c) => (
          <label className="filter-row" key={c.key}>
            <input type="radio" name="cat" checked={category === c.key} onChange={() => update({ category: c.key, page: 1 })} /> {c.name}
          </label>
        ))}
      </div>
      <div className="filter-group">
        <h5>Price Range</h5>
        <div className="range-row">
          <input type="number" min="0" value={minPrice} onChange={(e) => update({ min: e.target.value, page: 1 })} aria-label="Minimum price" />
          <span>–</span>
          <input type="number" min="0" value={maxPrice} onChange={(e) => update({ max: e.target.value, page: 1 })} aria-label="Maximum price" />
        </div>
      </div>
      <div className="filter-group">
        <h5>Filter by</h5>
        <label className="filter-row"><input type="checkbox" checked={onlyNew} onChange={(e) => update({ new: e.target.checked ? "1" : "", page: 1 })} /> New Arrivals</label>
        <label className="filter-row"><input type="checkbox" checked={onlySale} onChange={(e) => update({ sale: e.target.checked ? "1" : "", page: 1 })} /> On Sale</label>
      </div>
    </div>
  );

  if (!mobileOpen) {
    return <div className="filters-desktop">{body}</div>;
  }
  return (
    <>
      <div className="filters-desktop">{body}</div>
      <div className="mobile-drawer">
        <div className="backdrop" onClick={() => setMobileOpen(false)} />
        <div className="panel">
          <button className="btn-icon" onClick={() => setMobileOpen(false)} aria-label="Close filters" style={{ marginBottom: 14 }}><FaTimes /></button>
          {body}
        </div>
      </div>
    </>
  );
}
