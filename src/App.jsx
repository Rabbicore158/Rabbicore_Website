import React, { useEffect } from "react";
import { RouterProvider, Routes, Route, useLocationPath } from "./utils/router.jsx";
import { ToastProvider, CartProvider, WishlistProvider, AuthProvider, RecentProvider, AdminDataProvider } from "./context/AppContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Collections from "./pages/Collections.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Ideas from "./pages/Ideas.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import BuyingGuides from "./pages/BuyingGuides.jsx";
import Search from "./pages/Search.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import AffiliateDisclosure from "./pages/AffiliateDisclosure.jsx";
import CookiePolicy from "./pages/CookiePolicy.jsx";
import NewsletterSuccess from "./pages/NewsletterSuccess.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminArticles from "./pages/admin/AdminArticles.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminCollections from "./pages/admin/AdminCollections.jsx";
import AdminMedia from "./pages/admin/AdminMedia.jsx";
import AdminHomepageBuilder from "./pages/admin/AdminHomepageBuilder.jsx";
import AdminPages from "./pages/admin/AdminPages.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import AdminAdmins from "./pages/admin/AdminAdmins.jsx";

const TITLES = {
  "/": "RabbiCore | Beautiful Homes, Better Living",
  "/shop": "Shop All Products | RabbiCore",
  "/collections": "Collections | RabbiCore",
  "/ideas": "Decor Ideas and Articles | RabbiCore",
  "/buying-guides": "Buying Guides | RabbiCore",
  "/search": "Search | RabbiCore",
  "/wishlist": "My Wishlist | RabbiCore",
  "/cart": "Your Cart | RabbiCore",
  "/checkout": "Checkout | RabbiCore",
  "/about": "About Us | RabbiCore",
  "/contact": "Contact Us | RabbiCore",
  "/faq": "FAQ | RabbiCore",
  "/privacy": "Privacy Policy | RabbiCore",
  "/terms": "Terms and Conditions | RabbiCore",
  "/affiliate-disclosure": "Affiliate Disclosure | RabbiCore",
  "/cookie-policy": "Cookie Policy | RabbiCore",
  "/newsletter-success": "Subscribed! | RabbiCore",
  "/admin/login": "Admin Login | RabbiCore",
};

function TitleManager() {
  const pathname = useLocationPath();
  useEffect(() => {
    document.title = TITLES[pathname] || "RabbiCore | Beautiful Homes, Better Living";
  }, [pathname]);
  return null;
}

function SiteChrome({ children }) {
  const pathname = useLocationPath();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}

function AppRoutes() {
  return (
    <SiteChrome>
      <TitleManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/ideas/:slug" element={<ArticleDetail />} />
        <Route path="/buying-guides" element={<BuyingGuides />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/newsletter-success" element={<NewsletterSuccess />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/articles" element={<AdminArticles />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/collections" element={<AdminCollections />} />
        <Route path="/admin/media" element={<AdminMedia />} />
        <Route path="/admin/homepage-builder" element={<AdminHomepageBuilder />} />
        <Route path="/admin/pages" element={<AdminPages />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/admins" element={<AdminAdmins />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SiteChrome>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <ToastProvider>
        <AdminDataProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentProvider>
                  <AppRoutes />
                </RecentProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </AdminDataProvider>
      </ToastProvider>
    </RouterProvider>
  );
}
