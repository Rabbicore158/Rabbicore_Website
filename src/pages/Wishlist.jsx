import React from "react";
import { Link } from "../utils/router.jsx";
import { useWishlist, useCart } from "../context/AppContext.jsx";
import { useAllProducts } from "../data/useCatalog.js";
import { ProductCard } from "../components/Cards.jsx";
import { Breadcrumbs } from "../components/Sections.jsx";

export default function Wishlist() {
  const { ids } = useWishlist();
  const products = useAllProducts();
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />
        <h1 className="section-title">My Wishlist ({items.length})</h1>
        <p className="section-sub">Saved right in your browser, so it's here next time you visit.</p>

        {items.length ? (
          <div className="product-grid" style={{ marginTop: 28 }}>
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">🤍</div>
            <h3>Your wishlist is empty</h3>
            <p>Tap the heart on any product to save it here for later.</p>
            <Link to="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        )}
      </div>
    </div>
  );
}
