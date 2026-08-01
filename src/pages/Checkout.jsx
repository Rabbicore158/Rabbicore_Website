import React from "react";
import { Link } from "../utils/router.jsx";
import { useCart } from "../context/AppContext.jsx";
import { useAllProducts } from "../data/useCatalog.js";
import { Breadcrumbs } from "../components/Sections.jsx";
import { FaAmazon, FaCheckCircle } from "../components/Icons.jsx";

export default function Checkout() {
  const { items, subtotal } = useCart();
  const products = useAllProducts();

  const withLinks = items.map((i) => {
    const full = products.find((p) => p.id === i.id);
    return { ...i, affiliateUrl: full?.affiliateUrl };
  });

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
        <h1 className="section-title">Checkout</h1>
        <p className="section-sub" style={{ maxWidth: 640 }}>
          RabbiCore doesn't process payments directly. Each product is fulfilled by our retail partner.
          Click "Buy on Amazon" for each item below to complete your purchase securely on their site.
        </p>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🛒</div>
            <h3>Your cart is empty</h3>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ maxWidth: 640, marginTop: 28 }}>
            {withLinks.map((i) => (
              <div key={i.id} className="card" style={{ display: "flex", gap: 16, padding: 14, marginBottom: 14, alignItems: "center" }}>
                <img src={i.image} alt={i.name} style={{ width: 70, height: 70, borderRadius: 12, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{i.name}</div>
                  <div style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Qty {i.qty} · ${(i.price * i.qty).toFixed(2)}</div>
                </div>
                {i.affiliateUrl && (
                  <a className="btn btn-primary btn-sm" href={i.affiliateUrl} target="_blank" rel="noopener sponsored noreferrer">
                    <FaAmazon /> Buy
                  </a>
                )}
              </div>
            ))}
            <div className="flex items-center" style={{ justifyContent: "space-between", padding: "18px 4px", fontWeight: 700, fontSize: 17 }}>
              <span>Estimated Total</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <FaCheckCircle style={{ color: "var(--success)", fontSize: 30, marginBottom: 10 }} />
              <p>As an Amazon Associate, RabbiCore earns from qualifying purchases at no extra cost to you.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
