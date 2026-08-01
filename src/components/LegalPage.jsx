import React from "react";
import { Breadcrumbs } from "./Sections.jsx";

export default function LegalPage({ title, updated, children }) {
  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: title }]} />
        <h1 className="section-title">{title}</h1>
        <p className="section-sub">Last updated: {updated}</p>
        <div className="legal-content" style={{ maxWidth: 780, marginTop: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
