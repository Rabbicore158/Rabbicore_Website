import React, { useRef, useState, useEffect } from "react";
import { Link } from "../utils/router.jsx";
import { useAllProducts, useAllArticles } from "../data/useCatalog.js";
import { ProductCard, ProductCardSkeleton, ArticleCard } from "../components/Cards.jsx";
import { CategoryGrid, TrustStrip, Testimonials, InstagramSection, Newsletter, ScrollerWrap } from "../components/Sections.jsx";
import Reveal from "../components/Reveal.jsx";
import { FaArrowRight } from "../components/Icons.jsx";
import { collections } from "../data/site.js";

const HERO_IMAGE = "/images/misc/rabbicore-hero.webp";
import { useAdminData } from "../context/AppContext.jsx";

function useSectionVisible(key) {
  const ctx = useAdminData();
  const section = ctx?.homeSections?.find((s) => s.key === key);
  return section ? section.visible : true;
}

export default function Home() {
  const products = useAllProducts();
  const articles = useAllArticles();
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const trending = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  const editorPicks = [...products].sort((a, b) => b.rating - a.rating).slice(8, 12);
  const latestArticles = articles.slice(0, 4);

  const showCategories = useSectionVisible("categories");
  const showTrending = useSectionVisible("trending");
  const showCollections = useSectionVisible("collections");
  const showEditorPicks = useSectionVisible("editorPicks");
  const showNewsletter = useSectionVisible("newsletter");
  const showArticles = useSectionVisible("articles");
  const showTrust = useSectionVisible("trust");
  const showTestimonials = useSectionVisible("testimonials");
  const showInstagram = useSectionVisible("instagram");

  return (
    <div className="page-fade">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-eyebrow eyebrow">Curated Home Decor</span>
            <h1>Create a Home <span className="accent">You Love</span></h1>
            <p className="lead">Curated home decor pieces and inspiring ideas for every space, handpicked to bring warmth, texture, and character into your home.</p>
            <div className="hero-cta">
              <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
              <Link to="/ideas" className="btn btn-outline">Explore Ideas</Link>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img
              src={HERO_IMAGE}
              alt="Warm, curated living room styled with natural textures"
              width={1200}
              height={1000}
              sizes="(max-width: 900px) 100vw, 50vw"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="hero-badge">
              <div className="testi-avatar" style={{ background: "var(--terracotta)" }}>4.9</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>Loved by 10,000+</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Happy customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showCategories && <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Browse</span>
              <h2 className="section-title">Shop by Room</h2>
            </div>
            <Link to="/shop" className="btn-ghost">View all rooms <FaArrowRight size={12} /></Link>
          </div>
          <Reveal><CategoryGrid /></Reveal>
        </div>
      </section>}

      {showTrending && <section className="section" style={{ background: "var(--cream-deep)" }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Popular Right Now</span>
              <h2 className="section-title">Trending This Week</h2>
            </div>
            <Link to="/shop" className="btn-ghost">View all products <FaArrowRight size={12} /></Link>
          </div>
          <ScrollerWrap refEl={scrollRef}>
            <div className="hscroll" ref={scrollRef}>
              {(loading ? Array.from({ length: 6 }) : trending).map((p, i) => (
                <div style={{ width: 250 }} key={p?.id || i}>
                  {loading ? <ProductCardSkeleton /> : <ProductCard product={p} />}
                </div>
              ))}
            </div>
          </ScrollerWrap>
        </div>
      </section>}

      {showCollections && <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Editor's Picks</span>
              <h2 className="section-title">Featured Collections</h2>
            </div>
            <Link to="/collections" className="btn-ghost">View all collections <FaArrowRight size={12} /></Link>
          </div>
          <div className="product-grid-3">
            {collections.slice(0, 3).map((c, i) => (
              <Reveal delay={i * 80} key={c.key}>
                <Link to={`/collections?c=${c.key}`} className="card" style={{ display: "block" }}>
                  <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                    <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s ease" }} loading="lazy" />
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
      </section>}

      {showEditorPicks && <section className="section" style={{ background: "var(--cream-deep)" }}>
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Top Rated</span><h2 className="section-title">Editor Picks</h2></div>
          </div>
          <div className="product-grid">
            {editorPicks.map((p, i) => (
              <Reveal delay={i * 60} key={p.id}><ProductCard product={p} /></Reveal>
            ))}
          </div>
        </div>
      </section>}

      {showNewsletter && <section className="section">
        <div className="container">
          <Reveal><Newsletter /></Reveal>
        </div>
      </section>}

      {showArticles && <section className="section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Get Inspired</span><h2 className="section-title">Latest Decor Ideas</h2></div>
            <Link to="/ideas" className="btn-ghost">View all articles <FaArrowRight size={12} /></Link>
          </div>
          <div className="article-grid">
            {latestArticles.map((a, i) => (
              <Reveal delay={i * 70} key={a.id}><ArticleCard article={a} /></Reveal>
            ))}
          </div>
        </div>
      </section>}

      {showTrust && <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal><TrustStrip /></Reveal>
        </div>
      </section>}

      {showTestimonials && <section className="section" style={{ background: "var(--cream-deep)" }}>
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Reviews</span><h2 className="section-title">What Our Customers Say</h2></div>
          </div>
          <Testimonials />
        </div>
      </section>}

      {showInstagram && <section className="section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">@RabbiCore</span><h2 className="section-title">Get Inspired on Instagram</h2></div>
          </div>
          <Reveal><InstagramSection /></Reveal>
        </div>
      </section>}
    </div>
  );
}
