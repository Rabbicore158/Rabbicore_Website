import React, { useMemo, useState } from "react";
import { useSearchParams } from "../utils/router.jsx";
import { useAllArticles } from "../data/useCatalog.js";
import { ArticleCard } from "../components/Cards.jsx";
import { Breadcrumbs } from "../components/Sections.jsx";
import Reveal from "../components/Reveal.jsx";

const CATS = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Dining Room", "Office", "Outdoor", "Lighting"];

export default function Ideas() {
  const articles = useAllArticles();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";

  const filtered = category ? articles.filter((a) => a.category === category) : articles;

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Ideas" }]} />
        <div className="section-head">
          <div>
            <span className="eyebrow">Get Inspired</span>
            <h1 className="section-title">Decor Ideas & Articles</h1>
            <p className="section-sub">Real, practical decorating advice, organized by room and ready to use this weekend.</p>
          </div>
        </div>

        <div className="hscroll" style={{ marginBottom: 30 }}>
          <button className={`btn ${!category ? "btn-primary" : "btn-outline"} btn-sm`} onClick={() => setParams({})}>All</button>
          {CATS.map((c) => (
            <button key={c} className={`btn ${category === c ? "btn-primary" : "btn-outline"} btn-sm`} onClick={() => setParams({ category: c })}>{c}</button>
          ))}
        </div>

        {filtered.length ? (
          <div className="article-grid">
            {filtered.map((a, i) => (
              <Reveal delay={(i % 8) * 50} key={a.id}><ArticleCard article={a} /></Reveal>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">📰</div>
            <h3>No articles in this category yet</h3>
            <p>Check back soon, or browse another category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
