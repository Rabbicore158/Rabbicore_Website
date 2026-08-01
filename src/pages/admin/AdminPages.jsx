import React from "react";
import AdminLayout from "./AdminLayout.jsx";
import { Link } from "../../utils/router.jsx";
import { FaEye } from "../../components/Icons.jsx";

const PAGES = [
  { path: "/", name: "Home" }, { path: "/shop", name: "Shop" }, { path: "/collections", name: "Collections" },
  { path: "/ideas", name: "Ideas" }, { path: "/buying-guides", name: "Buying Guides" }, { path: "/search", name: "Search" },
  { path: "/wishlist", name: "Wishlist" }, { path: "/cart", name: "Cart" }, { path: "/about", name: "About" },
  { path: "/contact", name: "Contact" }, { path: "/faq", name: "FAQ" }, { path: "/privacy", name: "Privacy Policy" },
  { path: "/terms", name: "Terms & Conditions" }, { path: "/affiliate-disclosure", name: "Affiliate Disclosure" },
  { path: "/cookie-policy", name: "Cookie Policy" },
];

export default function AdminPages() {
  return (
    <AdminLayout title="Pages">
      <p style={{ color: "var(--ink-soft)", marginBottom: 20, maxWidth: 640 }}>
        Static pages built into the site. Content for legal pages is edited directly in code
        (<code>src/pages/*.jsx</code>) since it rarely changes.
      </p>
      <table className="admin-table">
        <thead><tr><th>Page</th><th>Path</th><th>Actions</th></tr></thead>
        <tbody>
          {PAGES.map((p) => (
            <tr key={p.path}>
              <td>{p.name}</td>
              <td><code>{p.path}</code></td>
              <td><Link to={p.path} className="btn btn-outline btn-sm"><FaEye /> View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
