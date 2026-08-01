import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useRouter, useLocationPath } from "../utils/router.jsx";
import {
  FaSearch, FaUser, FaBars, FaTimes, FaChevronDown,
} from "./Icons.jsx";
import { categories, collections } from "../data/site.js";
import { useCart, useWishlist } from "../context/AppContext.jsx";
import { useAllProducts } from "../data/useCatalog.js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { navigate } = useRouter();
  const pathname = useLocationPath();
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || searchOpen ? "hidden" : "";
  }, [drawerOpen, searchOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop", dropdown: categories.map((c) => ({ to: `/shop?category=${c.key}`, label: c.name })) },
    { to: "/ideas", label: "Ideas", dropdown: [
      { to: "/ideas", label: "All Articles" },
      { to: "/buying-guides", label: "Buying Guides" },
    ] },
    { to: "/collections", label: "Collections" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <Link to="/" className="logo">
            <img src="/images/logo.webp" alt="RabbiCore logo" />
            <span className="logo-text">
              <b>RabbiCore</b>
              <span>Beautiful Homes, Better Living</span>
            </span>
          </Link>

          <nav className="nav-main" aria-label="Main navigation">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div className="dropdown-wrap" key={link.to}>
                  <Link to={link.to} className={pathname.startsWith(link.to) && link.to !== "/" ? "active" : ""}>
                    {link.label} <FaChevronDown size={10} style={{ marginLeft: 4 }} />
                  </Link>
                  <div className="dropdown-panel">
                    {link.dropdown.map((d) => (
                      <Link key={d.to} to={d.to}>{d.label}</Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={link.to} to={link.to} className={pathname === link.to ? "active" : ""}>
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="header-actions">
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <FaSearch />
            </button>
            <Link to="/wishlist" className="icon-btn emoji-icon" aria-label="Wishlist">
              <span role="img" aria-hidden="true">❤️</span>
              {wishCount > 0 && <span className="badge-count">{wishCount}</span>}
            </Link>
            <Link to="/cart" className="icon-btn emoji-icon" aria-label="Cart">
              <span role="img" aria-hidden="true">🛒</span>

              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </Link>
            <Link to="/admin/login" className="icon-btn" aria-label="Admin login">
              <FaUser />
            </Link>
            <button className="icon-btn menu-toggle" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {drawerOpen && (
        <div className="mobile-drawer">
          <div className="backdrop" onClick={() => setDrawerOpen(false)} />
          <div className="panel">
            <div className="flex items-center" style={{ justifyContent: "space-between", marginBottom: 20 }}>
              <span className="logo-text"><b style={{ fontFamily: "var(--font-display)", color: "var(--terracotta-dark)", fontSize: 20 }}>RabbiCore</b></span>
              <button className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close menu"><FaTimes /></button>
            </div>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              {categories.map((c) => (
                <Link className="sub" key={c.key} to={`/shop?category=${c.key}`}>{c.name}</Link>
              ))}
              <Link to="/collections">Collections</Link>
              <Link to="/ideas">Ideas</Link>
              <Link to="/buying-guides">Buying Guides</Link>
              <Link to="/search">Search</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/admin/login">Admin Login</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function SearchOverlay({ onClose }) {
  const [q, setQ] = useState("");
  const { navigate } = useRouter();
  const products = useAllProducts();
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.trim().toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(term) || p.categoryName.toLowerCase().includes(term))
      .slice(0, 6);
  }, [q, products]);

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      onClose();
    }
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={submit} className="flex items-center gap-8">
          <FaSearch style={{ color: "var(--ink-soft)" }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, rooms, styles..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search"><FaTimes /></button>
        </form>
        {results.length > 0 && (
          <div className="search-results">
            {results.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="search-result-row" onClick={onClose}>
                <img src={p.images[0]} alt="" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>${p.price.toFixed(2)} · {p.categoryName}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {q.trim() && results.length === 0 && (
          <p style={{ padding: "16px 6px", color: "var(--ink-soft)", fontSize: 14 }}>No matches yet. Press enter to search all results.</p>
        )}
      </div>
    </div>
  );
}
