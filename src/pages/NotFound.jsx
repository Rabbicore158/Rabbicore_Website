import React, { useEffect } from "react";
import { Link } from "../utils/router.jsx";

export default function NotFound() {
  useEffect(() => { document.title = "Page Not Found | RabbiCore"; }, []);
  return (
    <div className="page-fade page-404">
      <div className="num">404</div>
      <h1 style={{ fontSize: 28, marginTop: 10 }}>Page Not Found</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 10, maxWidth: 420, marginInline: "auto" }}>
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div className="flex gap-8" style={{ justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
        <Link to="/shop" className="btn btn-outline">Browse Shop</Link>
      </div>
    </div>
  );
}
