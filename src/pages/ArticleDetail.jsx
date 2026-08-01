import React, { useMemo, useEffect } from "react";
import { useParams, Link } from "../utils/router.jsx";
import { useAllArticles } from "../data/useCatalog.js";
import { useAllProducts } from "../data/useCatalog.js";
import { Breadcrumbs } from "../components/Sections.jsx";
import { ArticleCard, ProductCard } from "../components/Cards.jsx";
import { ArticleContent, slugifyHeading } from "../utils/markdown.jsx";
import { FaClock } from "../components/Icons.jsx";
import NotFound from "./NotFound.jsx";

export default function ArticleDetail() {
  const { slug } = useParams("/ideas/:slug") || {};
  const articles = useAllArticles();
  const products = useAllProducts();
  const article = useMemo(() => articles.find((a) => a.slug === slug), [articles, slug]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | RabbiCore`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", article.excerpt.slice(0, 155));
      window.scrollTo(0, 0);
    }
  }, [article?.id]);

  if (!article) return <NotFound />;

  const relatedPosts = articles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3);
  const categoryMap = {
    "Living Room": "living-room", "Bedroom": "bedroom", "Kitchen": "kitchen", "Bathroom": "bathroom",
    "Dining Room": "dining-room", "Office": "office", "Outdoor": "outdoor", "Lighting": "lighting",
  };
  const relatedProducts = products.filter((p) => p.category === categoryMap[article.category]).slice(0, 4);

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Ideas", to: "/ideas" }, { label: article.title }]} />

        <div style={{ maxWidth: 820 }}>
          <span className="eyebrow">{article.category}</span>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", marginTop: 8, lineHeight: 1.15 }}>{article.title}</h1>
          <div className="article-meta" style={{ marginTop: 14, fontSize: 14 }}>
            <span>By {article.author}</span> · <span>{article.date}</span> · <span><FaClock size={12} /> {article.readTime}</span>
          </div>
        </div>

        <div style={{ borderRadius: "var(--radius)", overflow: "hidden", margin: "26px 0 40px", boxShadow: "var(--shadow-sm)" }}>
          <img src={article.heroImage} alt={article.title} style={{ width: "100%", aspectRatio: "16/7", objectFit: "cover" }} />
        </div>

        <div className="article-layout">
          {article.isHtml ? (
            <div className="article-content" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
          ) : (
            <ArticleContent content={article.content} />
          )}

          <aside>
            {article.toc && article.toc.length > 0 && (
              <div className="toc-box">
                <h4>Table of Contents</h4>
                {article.toc.map((t, i) => {
                  const label = t.replace(/^\d+\.\s*/, "");
                  return <a key={i} href={`#${slugifyHeading(label)}`}>{t}</a>;
                })}
              </div>
            )}
          </aside>
        </div>

        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <h2 className="section-title" style={{ fontSize: 24, marginBottom: 20 }}>Shop the Look</h2>
            <div className="product-grid">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <h2 className="section-title" style={{ fontSize: 24, marginBottom: 20 }}>Related Posts</h2>
            <div className="article-grid">
              {relatedPosts.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
