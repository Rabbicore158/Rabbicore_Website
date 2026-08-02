import React from "react";
import { Link } from "../utils/router.jsx";
import { useCart } from "../context/AppContext.jsx";
import { Breadcrumbs } from "../components/Sections.jsx";
import { FaMinus, FaPlus, FaTrash } from "../components/Icons.jsx";

export default function Cart() {
  const { items, remove, setQty, subtotal } = useCart();
  const shipping = items.length ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
        <h1 className="section-title">Your Cart ({items.length})</h1>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add something you love and it will show up here.</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout" style={{ marginTop: 28 }}>
            <div>
              {items.map((i) => (
                <div key={i.id} className="card" style={{ display: "flex", gap: 16, padding: 14, marginBottom: 14, alignItems: "center" }}>
                  <Link to={`/product/${i.slug}`}><img src={i.image} alt={i.name} style={{ width: 84, height: 84, borderRadius: 14, objectFit: "cover" }} /></Link>
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${i.slug}`}><div style={{ fontWeight: 600 }}>{i.name}</div></Link>
                    <div style={{ color: "var(--terracotta-dark)", fontWeight: 700, marginTop: 6 }}>${i.price.toFixed(2)}</div>
                  </div>
                  <div className="qty-selector">
                    <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease quantity"><FaMinus size={11} /></button>
                    <span>{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase quantity"><FaPlus size={11} /></button>
                  </div>
                  <button className="icon-btn" onClick={() => remove(i.id)} aria-label={`Remove ${i.name}`}><FaTrash /></button>
                </div>
              ))}
              <Link to="/shop" className="btn-ghost">← Continue Shopping</Link>
            </div>

            <div className="card" style={{ padding: 24, height: "fit-content" }}>
              <h3 style={{ marginBottom: 18 }}>Order Summary</h3>
              <div className="flex items-center" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "var(--ink-soft)" }}>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center" style={{ justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ color: "var(--ink-soft)" }}>Shipping</span><span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex items-center" style={{ justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 14, fontWeight: 700, fontSize: 18 }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>Proceed to Checkout</Link>
              <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 12, textAlign: "center" }}>
                Items link out to our retail partners for secure checkout.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
