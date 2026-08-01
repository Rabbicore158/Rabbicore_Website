import React from "react";
import { Link } from "../utils/router.jsx";
import {
  FaFacebookF, FaInstagram, FaPinterestP, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt,
} from "./Icons.jsx";
import { categories } from "../data/site.js";
import { useAdminData } from "../context/AppContext.jsx";

export default function Footer() {
  const year = new Date().getFullYear();
  const ctx = useAdminData();
  const settings = ctx?.settings || { siteName: "RabbiCore", email: "rabbicore158@gmail.com" };
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src="/images/logo.png" alt="RabbiCore logo" style={{ width: 40, height: 40 }} />
              <span className="logo-text"><b style={{ color: "white", fontFamily: "var(--font-display)", fontSize: 19 }}>{settings.siteName}</b></span>
            </Link>
            <p>Curated home decor picks and real, practical decorating ideas for every room and every budget.</p>
            <div className="social-row">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF size={14} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={14} /></a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><FaPinterestP size={14} /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube size={14} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop">All Products</Link>
            {categories.slice(0, 4).map((c) => (
              <Link key={c.key} to={`/shop?category=${c.key}`}>{c.name}</Link>
            ))}
          </div>

          <div className="footer-col">
            <h4>Ideas</h4>
            <Link to="/ideas?category=Living%20Room">Living Room Ideas</Link>
            <Link to="/ideas?category=Bedroom">Bedroom Ideas</Link>
            <Link to="/ideas?category=Kitchen">Kitchen Ideas</Link>
            <Link to="/ideas?category=Kitchen">DIY & Decor Tips</Link>
            <Link to="/buying-guides">Buying Guides</Link>
            <Link to="/buying-guides">Size Guide</Link>
          </div>

          <div className="footer-col">
            <h4>Customer Care</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/affiliate-disclosure">Affiliate Disclosure</Link>
            <Link to="/newsletter-success">Track Order</Link>
            <Link to="/faq">Buying Guides</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
            <span style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}><FaEnvelope size={12} /> {settings.email}</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {settings.siteName}. All rights reserved.</span>
          <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/affiliate-disclosure">Affiliate Disclosure</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
