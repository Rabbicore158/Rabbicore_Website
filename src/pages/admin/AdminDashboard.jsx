import React, { useMemo } from "react";
import { Link } from "../../utils/router.jsx";
import AdminLayout from "./AdminLayout.jsx";
import { useAllProducts, useAllArticles } from "../../data/useCatalog.js";
import { FaBoxOpen, FaNewspaper, FaThLarge, FaUserShield, FaPlusCircle } from "../../components/Icons.jsx";

const mockOrders = [
  { id: "#RC1001", customer: "Sarah Johnson", date: "May 20, 2025", total: "$249.00", status: "completed" },
  { id: "#RC1002", customer: "Michael Brown", date: "May 19, 2025", total: "$189.00", status: "processing" },
  { id: "#RC1003", customer: "Emily Davis", date: "May 18, 2025", total: "$309.00", status: "completed" },
  { id: "#RC1004", customer: "James Wilson", date: "May 17, 2025", total: "$149.00", status: "pending" },
];

export default function AdminDashboard() {
  const products = useAllProducts();
  const articles = useAllArticles();
  const categoryCount = useMemo(() => new Set(products.map((p) => p.category)).size, [products]);

  const stats = [
    { icon: <FaBoxOpen />, num: products.length, label: "Total Products" },
    { icon: <FaNewspaper />, num: mockOrders.length * 86, label: "Total Orders (demo)" },
    { icon: <FaThLarge />, num: categoryCount, label: "Categories" },
    { icon: <FaUserShield />, num: articles.length, label: "Published Articles" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="stat-cards">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="num">{s.num}</div>
            <div className="lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Recent Orders</h3>
          <table className="admin-table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {mockOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td><td>{o.customer}</td><td>{o.date}</td><td>{o.total}</td>
                  <td><span className={`status-pill ${o.status}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 12 }}>
            Demo data. Connect a real backend to track live orders.
          </p>
        </div>

        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/admin/products?new=1" className="btn btn-outline btn-block"><FaPlusCircle /> Add New Product</Link>
            <Link to="/admin/articles?new=1" className="btn btn-outline btn-block"><FaPlusCircle /> Add New Article</Link>
            <Link to="/admin/homepage-builder" className="btn btn-outline btn-block"><FaPlusCircle /> Edit Homepage</Link>
            <Link to="/admin/settings" className="btn btn-outline btn-block"><FaPlusCircle /> Site Settings</Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
