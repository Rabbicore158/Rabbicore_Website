import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useRouter } from "../utils/router.jsx";
import { useAllProducts } from "../data/useCatalog.js";
import { Breadcrumbs } from "../components/Sections.jsx";
import { ProductCard } from "../components/Cards.jsx";
import {
  Stars, FaHeart, FaRegHeart, FaShoppingCart, FaAmazon, FaMinus, FaPlus,
  FaCheckCircle, FaTruck, FaShieldAlt,
} from "../components/Icons.jsx";
import { useCart, useWishlist, useRecent } from "../context/AppContext.jsx";
import NotFound from "./NotFound.jsx";

function generateReviews(product) {
  const names = ["Sarah J.", "Michael B.", "Emily D.", "James W.", "Olivia M.", "Daniel L.", "Grace K.", "Noah P."];
  const comments = [
    "Exactly as described and arrived well packaged. Very happy with this purchase.",
    "Great quality for the price. Took a bit longer to assemble than expected but worth it.",
    "Looks even better in person than in the photos. Would buy again.",
    "Solid piece, though the color is slightly warmer than it appears online.",
    "Perfect fit for my space. I measured carefully beforehand and it worked out great.",
    "Sturdy and well made. Assembly instructions were clear.",
  ];
  const count = Math.min(6, Math.max(3, Math.floor(product.reviews / 60)));
  return Array.from({ length: count }).map((_, i) => ({
    name: names[(product.id + i) % names.length],
    rating: Math.max(3, Math.min(5, Math.round(product.rating) - (i % 2))),
    comment: comments[(product.id + i * 3) % comments.length],
    date: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][(product.id + i) % 7]} ${2 + i}, 2025`,
  }));
}

export default function ProductDetail() {
  const { slug } = useParams("/product/:slug") || {};
  const products = useAllProducts();
  const product = useMemo(() => products.find((p) => p.slug === slug), [products, slug]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { add: addRecent } = useRecent();
  const { navigate } = useRouter();

  useEffect(() => {
    if (product) {
      setActiveImg(0);
      setQty(1);
      setTab("description");
      addRecent(product.id);
      window.scrollTo(0, 0);
      document.title = `${product.name} | RabbiCore`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", product.description.slice(0, 155));
    }
    // eslint-disable-next-line
  }, [product?.id]);

  if (!product) return <NotFound />;

  const reviews = generateReviews(product);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const wished = has(product.id);

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/shop" },
          { label: product.categoryName, to: `/shop?category=${product.category}` },
          { label: product.name },
        ]} />

        <div className="pd-layout">
          <div>
            <div className="pd-gallery-main">
              <img src={product.images[activeImg]} alt={product.name} />
            </div>
            <div className="pd-thumbs">
              {product.images.map((img, i) => (
                <button key={i} className={`pd-thumb ${activeImg === i ? "active" : ""}`} onClick={() => setActiveImg(i)} aria-label={`View image ${i + 1}`}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="pd-title">{product.name}</h1>
            <div className="product-rating" style={{ marginTop: 10 }}>
              <Stars rating={product.rating} size={16} /> <span>{product.rating} ({product.reviews} reviews)</span>
            </div>
            <div className="pd-price-row">
              <span className="now">${product.price.toFixed(2)}</span>
              {product.onSale && <span className="was">${product.originalPrice.toFixed(2)}</span>}
              {product.onSale && <span style={{ color: "var(--success)", fontWeight: 600, fontSize: 13.5 }}>Save {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>}
            </div>
            <p className="pd-desc">{product.description}</p>

            <ul className="pd-feature-list">
              {product.features.map((f, i) => (
                <li key={i}><FaCheckCircle size={14} /> {f}</li>
              ))}
            </ul>

            <div className="flex items-center gap-8" style={{ marginTop: 20 }}>
              <div className="qty-selector">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><FaMinus size={11} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity"><FaPlus size={11} /></button>
              </div>
            </div>

            <div className="pd-actions">
              <button className="btn btn-primary" onClick={() => add(product, qty)}><FaShoppingCart /> Add to Cart</button>
              <a className="btn btn-outline" href={product.affiliateUrl} target="_blank" rel="noopener sponsored noreferrer">
                <FaAmazon /> Buy on Amazon
              </a>
              <button className={`btn-icon ${wished ? "active" : ""}`} onClick={() => toggle(product)} aria-label="Toggle wishlist">
                {wished ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            <div className="flex gap-8" style={{ marginTop: 22, color: "var(--ink-soft)", fontSize: 13 }}>
              <span className="flex items-center gap-8"><FaTruck /> Fast shipping</span>
              <span className="flex items-center gap-8"><FaShieldAlt /> Secure checkout</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          {["description", "details", "shipping", `reviews (${reviews.length})`].map((t) => {
            const key = t.split(" ")[0];
            return (
              <button key={t} className={`tab-btn ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            );
          })}
        </div>

        {tab === "description" && (
          <div style={{ maxWidth: 720 }}>
            <p style={{ color: "var(--ink-soft)" }}>{product.description}</p>
          </div>
        )}
        {tab === "details" && (
          <div className="grid-2" style={{ maxWidth: 720 }}>
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <span style={{ color: "var(--ink-soft)" }}>{k}</span><strong>{v}</strong>
              </div>
            ))}
          </div>
        )}
        {tab === "shipping" && (
          <div style={{ maxWidth: 720, color: "var(--ink-soft)" }}>
            <p>This item is fulfilled through our retail partner. Estimated delivery is typically 3–7 business days depending on your location, selected at checkout on the retailer's site.</p>
            <p style={{ marginTop: 12 }}>Returns and exchanges are handled directly by the retailer according to their return policy. Check the retailer's page for specifics before ordering.</p>
          </div>
        )}
        {tab === "reviews" && (
          <div style={{ maxWidth: 720 }}>
            {reviews.map((r, i) => (
              <div key={i} className="review-row">
                <div className="flex items-center gap-8" style={{ justifyContent: "space-between" }}>
                  <strong>{r.name}</strong>
                  <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{r.date}</span>
                </div>
                <Stars rating={r.rating} />
                <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <h2 className="section-title" style={{ fontSize: 26, marginBottom: 22 }}>You May Also Like</h2>
            <div className="product-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
