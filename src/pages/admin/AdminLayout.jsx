import React, { useEffect, useState } from "react";
import { Link, useRouter, useLocationPath } from "../../utils/router.jsx";
import { useAuth } from "../../context/AppContext.jsx";
import {
  FaTachometerAlt, FaBoxOpen, FaNewspaper, FaThLarge, FaLayerGroup, FaImages,
  FaCog, FaSignOutAlt, FaUserShield, FaBars, FaTimes, FaEye,
} from "../../components/Icons.jsx";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/admin/products", label: "Products", icon: FaBoxOpen },
  { to: "/admin/articles", label: "Articles", icon: FaNewspaper },
  { to: "/admin/categories", label: "Categories", icon: FaThLarge },
  { to: "/admin/collections", label: "Collections", icon: FaLayerGroup },
  { to: "/admin/media", label: "Media", icon: FaImages },
  { to: "/admin/homepage-builder", label: "Homepage Builder", icon: FaLayerGroup },
  { to: "/admin/pages", label: "Pages", icon: FaThLarge },
  { to: "/admin/settings", label: "Settings", icon: FaCog },
  { to: "/admin/profile", label: "Profile", icon: FaUserShield },
];

export default function AdminLayout({ children, title }) {
  const { session, logout } = useAuth();
  const { navigate } = useRouter();
  const pathname = useLocationPath();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!session) navigate("/admin/login", { replace: true });
  }, [session]);

  useEffect(() => setSidebarOpen(false), [pathname]);

  if (!session) return null;

  const isSuperAdmin = session.role === "superadmin";
  const nav = isSuperAdmin ? [...NAV.slice(0, 4), { to: "/admin/admins", label: "Admins", icon: FaUserShield }, ...NAV.slice(4)] : NAV;

  return (
    <div className="admin-shell page-fade">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="flex items-center" style={{ justifyContent: "space-between", marginBottom: 26 }}>
          <Link to="/" className="logo">
            <span className="logo-text"><b style={{ fontFamily: "var(--font-display)", fontSize: 19 }}>RabbiCore</b></span>
          </Link>
          <button className="icon-btn menu-toggle" style={{ color: "white" }} onClick={() => setSidebarOpen(false)} aria-label="Close menu"><FaTimes /></button>
        </div>
        <nav className="admin-nav">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={pathname === n.to ? "active" : ""}>
              <n.icon size={14} /> {n.label}
            </Link>
          ))}
          <Link to="/"><FaEye size={14} /> View Site</Link>
          <button className="link" onClick={() => { logout(); navigate("/admin/login"); }}>
            <FaSignOutAlt size={14} /> Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="flex items-center gap-8">
            <button className="icon-btn menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><FaBars /></button>
            <h1 style={{ fontSize: 24 }}>{title}</h1>
          </div>
          <div className="flex items-center gap-8" style={{ fontSize: 14 }}>
            <span className="admin-avatar">{session.avatar || "🙂"}</span>
            <span>{session.label}</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
