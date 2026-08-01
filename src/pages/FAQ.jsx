import React, { useState } from "react";
import { Breadcrumbs } from "../components/Sections.jsx";
import { faqs } from "../data/site.js";
import { FaChevronDown } from "../components/Icons.jsx";

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "FAQ" }]} />
        <span className="eyebrow">Need Help?</span>
        <h1 className="section-title">Frequently Asked Questions</h1>
        <p className="section-sub">Can't find what you're looking for? Reach out on our Contact page.</p>

        <div style={{ maxWidth: 760, marginTop: 30 }}>
          {faqs.map((f, i) => (
            <div key={i} className="card" style={{ marginBottom: 12, overflow: "hidden" }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "transparent", border: "none", textAlign: "left", fontWeight: 600, fontSize: 15.5 }}
                aria-expanded={open === i}
              >
                {f.q}
                <FaChevronDown style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform .2s ease", flexShrink: 0, marginLeft: 12 }} />
              </button>
              <div style={{ maxHeight: open === i ? 200 : 0, overflow: "hidden", transition: "max-height .3s ease" }}>
                <p style={{ padding: "0 22px 20px", color: "var(--ink-soft)" }}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
