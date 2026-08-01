import React from "react";
import { Link } from "../utils/router.jsx";
import { Breadcrumbs, TrustStrip } from "../components/Sections.jsx";
import Reveal from "../components/Reveal.jsx";

const ABOUT_IMAGE = "/images/misc/about-rabbicore.png";

export default function About() {
  const stats = [
    { num: "500+", label: "Curated Products" },
    { num: "10K+", label: "Happy Customers" },
    { num: "50+", label: "Home Decor Ideas" },
    { num: "100%", label: "Quality Assured" },
  ];

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
        <div className="hero-grid" style={{ alignItems: "center" }}>
          <div>
            <span className="eyebrow">Our Story</span>
            <h1 className="section-title" style={{ fontSize: "clamp(28px,4vw,42px)", marginTop: 8 }}>About RabbiCore</h1>
            <p style={{ color: "var(--ink-soft)", fontSize: 16.5, marginTop: 18, lineHeight: 1.7 }}>
              We believe every home has a story to tell, and our mission is to help you create beautiful
              spaces with carefully curated decor and inspiring ideas to make a house feel like home.
            </p>
            <p style={{ color: "var(--ink-soft)", fontSize: 16.5, marginTop: 14, lineHeight: 1.7 }}>
              RabbiCore started as a simple idea: home decor shopping shouldn't mean choosing between good
              taste and useful information. Every product we feature comes with real dimensions, real
              materials, and honest descriptions, and every article we publish is written to be used, not
              just admired. We spend hours researching what actually works in real homes before we recommend
              anything, and we're always adding new pieces and guides as our own collection of ideas grows.
            </p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: 20 }}>Shop Collection</Link>
          </div>
          <Reveal>
            <div className="hero-image-wrap">
              <img src={ABOUT_IMAGE} alt="A warm, styled living space" />
            </div>
          </Reveal>
        </div>

        <div className="product-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginTop: 70 }}>
          {stats.map((s, i) => (
            <Reveal delay={i * 60} key={s.label}>
              <div className="card text-center" style={{ padding: "28px 14px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--terracotta-dark)" }}>{s.num}</div>
                <div style={{ color: "var(--ink-soft)", fontSize: 13.5, marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <div style={{ marginTop: 70 }}>
          <Reveal><TrustStrip /></Reveal>
        </div>
      </div>
    </div>
  );
}
