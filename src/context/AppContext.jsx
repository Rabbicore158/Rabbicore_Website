import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { adminAccounts } from "../data/site.js";

// ---------- Toast ----------
const ToastCtx = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const push = useCallback((message, type = "success") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

// ---------- LocalStorage helper ----------
function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

// ---------- Cart ----------
const CartCtx = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useLocalState("rc_cart", []);
  const { push } = useToast();

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0], qty }];
    });
    push(`${product.name} added to cart`, "success");
  };
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const setQty = (id, qty) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartCtx.Provider value={{ items, add, remove, setQty, clear, subtotal, count }}>
      {children}
    </CartCtx.Provider>
  );
}
export const useCart = () => useContext(CartCtx);

// ---------- Wishlist ----------
const WishCtx = createContext(null);
export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalState("rc_wishlist", []);
  const { push } = useToast();
  const toggle = (product) => {
    setIds((prev) => {
      if (prev.includes(product.id)) {
        push(`Removed from wishlist`, "success");
        return prev.filter((i) => i !== product.id);
      }
      push(`Added to wishlist`, "success");
      return [...prev, product.id];
    });
  };
  const has = (id) => ids.includes(id);
  return <WishCtx.Provider value={{ ids, toggle, has, count: ids.length }}>{children}</WishCtx.Provider>;
}
export const useWishlist = () => useContext(WishCtx);

// ---------- Auth (admin) ----------
const AuthCtx = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useLocalState("rc_admin_session", null);
  const [extraAdmins, setExtraAdmins] = useLocalState("rc_extra_admins", []);

  const login = (username, password) => {
    const all = [...adminAccounts, ...extraAdmins];
    const found = all.find((a) => a.username === username && a.password === password);
    if (!found) return { ok: false, error: "Invalid username or password." };
    setSession({ username: found.username, role: found.role, label: found.label, avatar: found.avatar || "🙂" });
    return { ok: true };
  };
  const logout = () => setSession(null);

  return (
    <AuthCtx.Provider value={{ session, login, logout, extraAdmins, setExtraAdmins }}>
      {children}
    </AuthCtx.Provider>
  );
}
export const useAuth = () => useContext(AuthCtx);

// ---------- Recently viewed ----------
const RecentCtx = createContext(null);
export function RecentProvider({ children }) {
  const [ids, setIds] = useLocalState("rc_recent", []);
  const add = (id) => setIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
  return <RecentCtx.Provider value={{ ids, add }}>{children}</RecentCtx.Provider>;
}
export const useRecent = () => useContext(RecentCtx);

// ---------- Admin CMS data (client-side, editable via dashboard) ----------
const AdminDataCtx = createContext(null);
export function AdminDataProvider({ children }) {
  const [extraProducts, setExtraProducts] = useLocalState("rc_admin_products", []);
  const [extraArticles, setExtraArticles] = useLocalState("rc_admin_articles", []);
  const [deletedProductIds, setDeletedProductIds] = useLocalState("rc_deleted_products", []);
  const [deletedArticleIds, setDeletedArticleIds] = useLocalState("rc_deleted_articles", []);
  const [settings, setSettings] = useLocalState("rc_settings", {
    siteName: "RabbiCore",
    tagline: "Beautiful Homes, Better Living",
    email: "rabbicore158@gmail.com",
    phone: "+92 345 7627926",
    address: "Misri Town 73/4R, Haroonabad, Punjab, Pakistan",
  });
  const [homeSections, setHomeSections] = useLocalState("rc_home_sections", [
    { key: "hero", label: "Hero Banner", visible: true },
    { key: "categories", label: "Shop by Room", visible: true },
    { key: "trending", label: "Trending This Week", visible: true },
    { key: "collections", label: "Featured Collections", visible: true },
    { key: "editorPicks", label: "Editor Picks", visible: true },
    { key: "newsletter", label: "Newsletter Band", visible: true },
    { key: "articles", label: "Latest Decor Ideas", visible: true },
    { key: "trust", label: "Trust Strip", visible: true },
    { key: "testimonials", label: "Testimonials", visible: true },
    { key: "instagram", label: "Instagram Strip", visible: true },
  ]);
  const [collectionOverrides, setCollectionOverrides] = useLocalState("rc_collection_overrides", {});
  const [mediaLibrary, setMediaLibrary] = useLocalState("rc_media_library", []);

  return (
    <AdminDataCtx.Provider
      value={{
        extraProducts, setExtraProducts,
        extraArticles, setExtraArticles,
        deletedProductIds, setDeletedProductIds,
        deletedArticleIds, setDeletedArticleIds,
        settings, setSettings,
        homeSections, setHomeSections,
        collectionOverrides, setCollectionOverrides,
        mediaLibrary, setMediaLibrary,
      }}
    >
      {children}
    </AdminDataCtx.Provider>
  );
}
export const useAdminData = () => useContext(AdminDataCtx);
