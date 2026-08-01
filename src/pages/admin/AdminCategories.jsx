import React from "react";
import AdminLayout from "./AdminLayout.jsx";
import { categories } from "../../data/site.js";
import { useAllProducts } from "../../data/useCatalog.js";
import { CategoryIcon } from "../../components/Icons.jsx";

export default function AdminCategories() {
  const products = useAllProducts();

  return (
    <AdminLayout title="Categories">
      <p style={{ color: "var(--ink-soft)", marginBottom: 20, maxWidth: 600 }}>
        Categories map directly to site navigation and product filters. To keep the storefront structure
        consistent, categories are fixed. Add products to an existing category from the Products tab.
      </p>
      <div className="stat-cards" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.key).length;
          return (
            <div className="stat-card" key={c.key}>
              <div className="flex items-center gap-8" style={{ marginBottom: 8 }}>
                <span className="icon-btn" style={{ background: "var(--cream-deep)", color: "var(--terracotta)" }}><CategoryIcon icon={c.icon} /></span>
              </div>
              <div className="num" style={{ fontSize: 24 }}>{count}</div>
              <div className="lbl">{c.name}</div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
