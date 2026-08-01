import React from "react";
import { Link } from "../utils/router.jsx";
import { FaCheckCircle } from "../components/Icons.jsx";

export default function NewsletterSuccess() {
  return (
    <div className="page-fade empty-state" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <FaCheckCircle style={{ fontSize: 54, color: "var(--success)", marginBottom: 18 }} />
      <h1 style={{ fontSize: 28 }}>You're subscribed!</h1>
      <p style={{ marginTop: 10, maxWidth: 420 }}>Thanks for joining the RabbiCore newsletter. Watch your inbox for your 10% off code and fresh decor ideas.</p>
      <Link to="/shop" className="btn btn-primary" style={{ marginTop: 20 }}>Start Shopping</Link>
    </div>
  );
}
