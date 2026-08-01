import React from "react";
import { useAllArticles } from "../data/useCatalog.js";
import { ArticleCard } from "../components/Cards.jsx";
import { Breadcrumbs } from "../components/Sections.jsx";
import Reveal from "../components/Reveal.jsx";

export default function BuyingGuides() {
  const articles = useAllArticles();
  const guides = articles.filter((a) => a.title.toLowerCase().includes("buying guide") || a.title.toLowerCase().includes("how to choose"));
  const fallback = guides.length ? guides : articles.slice(0, 6);

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Buying Guides" }]} />
        <span className="eyebrow">Shop Smarter</span>
        <h1 className="section-title">Buying Guides</h1>
        <p className="section-sub">Straightforward, practical guides for choosing furniture that actually fits your space and lasts.</p>

        <div className="article-grid" style={{ marginTop: 30 }}>
          {fallback.map((a, i) => (
            <Reveal delay={(i % 8) * 50} key={a.id}><ArticleCard article={a} /></Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
