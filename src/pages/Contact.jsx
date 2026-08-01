import React, { useState } from "react";
import { Breadcrumbs } from "../components/Sections.jsx";
import { useToast, useAdminData } from "../context/AppContext.jsx";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "../components/Icons.jsx";

function useFormspree(endpoint, fields) {
  const [values, setValues] = useState(fields);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const { push } = useToast();

  const set = (k, v) => { setValues((prev) => ({ ...prev, [k]: v })); setErrors((prev) => ({ ...prev, [k]: null })); };

  const validate = () => {
    const errs = {};
    Object.entries(values).forEach(([k, v]) => {
      if (!v || !v.toString().trim()) errs[k] = "This field is required.";
    });
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) errs.email = "Enter a valid email address.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setStatus("success");
        push("Message sent. We'll be in touch soon.", "success");
        setValues(fields);
      } else {
        setStatus("error");
        push("Something went wrong. Please try again.", "error");
      }
    } catch {
      setStatus("error");
      push("Network error. Please try again.", "error");
    }
  };

  return { values, set, errors, status, submit };
}

export default function Contact() {
  const [tab, setTab] = useState("contact");
  const contact = useFormspree("https://formspree.io/f/mkodazew", { name: "", email: "", subject: "", message: "" });
  const suggest = useFormspree("https://formspree.io/f/mwvgjqzp", { name: "", email: "", productName: "", productLink: "", notes: "" });
  const ctx = useAdminData();
  const settings = ctx?.settings || { email: "rabbicore158@gmail.com", phone: "+92 345 7627926", address: "Misri Town 73/4R, Haroonabad, Punjab, Pakistan" };

  return (
    <div className="page-fade section">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
        <span className="eyebrow">Get in Touch</span>
        <h1 className="section-title">Contact Us</h1>
        <p className="section-sub">Have a question or need help? We're here for you.</p>

        <div className="grid-2" style={{ marginTop: 30, alignItems: "start" }}>
          <div>
            <div className="tabs" style={{ marginTop: 0 }}>
              <button className={`tab-btn ${tab === "contact" ? "active" : ""}`} onClick={() => setTab("contact")}>Contact Us</button>
              <button className={`tab-btn ${tab === "suggest" ? "active" : ""}`} onClick={() => setTab("suggest")}>Suggest a Product</button>
            </div>

            {tab === "contact" ? (
              <form className="form-card" onSubmit={contact.submit} noValidate>
                <div className="form-field">
                  <label htmlFor="c-name">Your Name</label>
                  <input id="c-name" className={contact.errors.name ? "invalid" : ""} value={contact.values.name} onChange={(e) => contact.set("name", e.target.value)} />
                  {contact.errors.name && <div className="error">{contact.errors.name}</div>}
                </div>
                <div className="form-field">
                  <label htmlFor="c-email">Your Email</label>
                  <input id="c-email" type="email" className={contact.errors.email ? "invalid" : ""} value={contact.values.email} onChange={(e) => contact.set("email", e.target.value)} />
                  {contact.errors.email && <div className="error">{contact.errors.email}</div>}
                </div>
                <div className="form-field">
                  <label htmlFor="c-subject">Subject</label>
                  <input id="c-subject" className={contact.errors.subject ? "invalid" : ""} value={contact.values.subject} onChange={(e) => contact.set("subject", e.target.value)} />
                  {contact.errors.subject && <div className="error">{contact.errors.subject}</div>}
                </div>
                <div className="form-field">
                  <label htmlFor="c-message">Message</label>
                  <textarea id="c-message" rows="5" className={contact.errors.message ? "invalid" : ""} value={contact.values.message} onChange={(e) => contact.set("message", e.target.value)} />
                  {contact.errors.message && <div className="error">{contact.errors.message}</div>}
                </div>
                <button className="btn btn-primary btn-block" disabled={contact.status === "loading"}>
                  {contact.status === "loading" ? "Sending..." : "Send Message"}
                </button>
                {contact.status === "success" && <p style={{ color: "var(--success)", marginTop: 12, textAlign: "center" }}>Thanks! Your message has been sent.</p>}
              </form>
            ) : (
              <form className="form-card" onSubmit={suggest.submit} noValidate>
                <div className="form-field">
                  <label htmlFor="s-name">Your Name</label>
                  <input id="s-name" className={suggest.errors.name ? "invalid" : ""} value={suggest.values.name} onChange={(e) => suggest.set("name", e.target.value)} />
                  {suggest.errors.name && <div className="error">{suggest.errors.name}</div>}
                </div>
                <div className="form-field">
                  <label htmlFor="s-email">Your Email</label>
                  <input id="s-email" type="email" className={suggest.errors.email ? "invalid" : ""} value={suggest.values.email} onChange={(e) => suggest.set("email", e.target.value)} />
                  {suggest.errors.email && <div className="error">{suggest.errors.email}</div>}
                </div>
                <div className="form-field">
                  <label htmlFor="s-product">Product Name</label>
                  <input id="s-product" className={suggest.errors.productName ? "invalid" : ""} value={suggest.values.productName} onChange={(e) => suggest.set("productName", e.target.value)} />
                  {suggest.errors.productName && <div className="error">{suggest.errors.productName}</div>}
                </div>
                <div className="form-field">
                  <label htmlFor="s-link">Product Link</label>
                  <input id="s-link" className={suggest.errors.productLink ? "invalid" : ""} value={suggest.values.productLink} onChange={(e) => suggest.set("productLink", e.target.value)} />
                  {suggest.errors.productLink && <div className="error">{suggest.errors.productLink}</div>}
                </div>
                <div className="form-field">
                  <label htmlFor="s-notes">Why should we feature it?</label>
                  <textarea id="s-notes" rows="4" className={suggest.errors.notes ? "invalid" : ""} value={suggest.values.notes} onChange={(e) => suggest.set("notes", e.target.value)} />
                  {suggest.errors.notes && <div className="error">{suggest.errors.notes}</div>}
                </div>
                <button className="btn btn-primary btn-block" disabled={suggest.status === "loading"}>
                  {suggest.status === "loading" ? "Submitting..." : "Submit Suggestion"}
                </button>
                {suggest.status === "success" && <p style={{ color: "var(--success)", marginTop: 12, textAlign: "center" }}>Thanks for the suggestion!</p>}
              </form>
            )}
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 18 }}>Get in Touch</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="flex gap-8" style={{ alignItems: "flex-start" }}>
                <span className="icon-btn" style={{ pointerEvents: "none" }}><FaEnvelope /></span>
                <div><div style={{ fontWeight: 600 }}>Email</div><div style={{ color: "var(--ink-soft)", fontSize: 14 }}>{settings.email}</div></div>
              </div>
              <div className="flex gap-8" style={{ alignItems: "flex-start" }}>
                <span className="icon-btn" style={{ pointerEvents: "none" }}><FaPhone /></span>
                <div><div style={{ fontWeight: 600 }}>Phone</div><div style={{ color: "var(--ink-soft)", fontSize: 14 }}>{settings.phone}</div></div>
              </div>
              <div className="flex gap-8" style={{ alignItems: "flex-start" }}>
                <span className="icon-btn" style={{ pointerEvents: "none" }}><FaMapMarkerAlt /></span>
                <div><div style={{ fontWeight: 600 }}>Address</div><div style={{ color: "var(--ink-soft)", fontSize: 14 }}>{settings.address}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
