import React, { useState } from "react";
import { Link } from "../utils/router.jsx";
import { CategoryIcon, FaTruck, FaShieldAlt, FaBolt, FaGem, FaQuoteLeft, FaChevronRight } from "./Icons.jsx";
import { categories, testimonials, instagramStrip } from "../data/site.js";
import { useToast } from "../context/AppContext.jsx";
import Reveal from "./Reveal.jsx";

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <FaChevronRight size={9} />}
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span style={{ color: "var(--ink)" }}>{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function CategoryGrid() {
  return (
    <div className="cat-grid">
      {categories.map((c, i) => (
        <Link to={`/shop?category=${c.key}`} key={c.key} className="cat-card">
          <span className="cat-icon"><CategoryIcon icon={c.icon} /></span>
          <span>{c.name}</span>
        </Link>
      ))}
    </div>
  );
}

export function TrustStrip() {
  const items = [
    { ic: <FaGem />, h: "Curated with Love", p: "Handpicked pieces from every room." },
    { ic: <FaShieldAlt />, h: "Quality You Can Trust", p: "Only premium, durable materials." },
    { ic: <FaBolt />, h: "Secure Shopping", p: "Safe & secure checkout, always." },
    { ic: <FaTruck />, h: "Fast Delivery", p: "Quick delivery right to your door." },
  ];
  return (
    <div className="trust-strip">
      {items.map((it, i) => (
        <div className="trust-item" key={i}>
          <span className="ic">{it.ic}</span>
          <div><h5>{it.h}</h5><p>{it.p}</p></div>
        </div>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <div className="hscroll">
      {testimonials.map((t, i) => (
        <div key={i} className="card testi-card" style={{ width: 320 }}>
          <FaQuoteLeft style={{ color: "var(--terracotta-light)", fontSize: 20, marginBottom: 10 }} />
          <div className="stars">
            {Array.from({ length: 5 }).map((_, s) => (
              <span key={s} style={{ opacity: s < t.rating ? 1 : 0.25 }}>★</span>
            ))}
          </div>
          <p className="quote">"{t.text}"</p>
          <div className="testi-who">
            <div className="testi-avatar">{t.name[0]}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{t.location}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function InstagramSection() {
  return (
    <div className="insta-grid">
      {instagramStrip.map((p) => (
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" key={p.id}>
          <img src={p.image} alt="RabbiCore inspiration on Instagram" loading="lazy" />
        </a>
      ))}
    </div>
  );
}

export function Newsletter({ compact = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const { push } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("https://formspree.io/f/mgogbzdj", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        push("You're subscribed! Check your inbox soon.", "success");
        setEmail("");
      } else {
        setStatus("error");
        push("Something went wrong. Please try again.", "error");
      }
    } catch {
      setStatus("error");
      push("Network error. Please try again.", "error");
    }
  };

  return (
    <div className="newsletter-band">
      <div>
        <h3>Get Ideas. Get Inspired. Get 10% Off.</h3>
        <p>Subscribe to our newsletter and never miss new decor ideas and exclusive offers.</p>
      </div>
      <div>
        <form className="newsletter-form" onSubmit={submit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            aria-label="Email address"
            required
          />
          <button className="btn btn-outline-light" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {status === "invalid" && <p style={{ color: "#FFE3D3", fontSize: 13, marginTop: 8 }}>Please enter a valid email address.</p>}
      </div>
    </div>
  );
}

export function ScrollerWrap({ children, refEl }) {
  const scroll = (dir) => {
    if (refEl.current) refEl.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };
  return (
    <div className="scroller-wrap">
      <button className="btn-icon scroller-arrow left" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
      {children}
      <button className="btn-icon scroller-arrow right" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
    </div>
  );
}
