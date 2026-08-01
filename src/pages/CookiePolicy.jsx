import React from "react";
import LegalPage from "../components/LegalPage.jsx";

export default function CookiePolicy() {
  return (
    <LegalPage title="Cookie Policy" updated="January 2026">
      <p>This Cookie Policy explains how RabbiCore uses cookies and similar browser storage technologies.</p>

      <h2>What We Use</h2>
      <ul>
        <li><strong>Local Storage:</strong> used to save your cart, wishlist, recent searches, and (for admins) dashboard session, all stored only in your own browser.</li>
        <li><strong>Essential Cookies:</strong> used to keep the site functioning correctly as you browse.</li>
      </ul>

      <h2>Managing Cookies and Storage</h2>
      <p>You can clear your browser's local storage at any time through your browser settings, which will reset your saved cart and wishlist. Blocking storage entirely may prevent some site features, like the cart, from working correctly.</p>

      <h2>Third-Party Cookies</h2>
      <p>Retail partners you visit through our affiliate links may set their own cookies according to their own cookie policies, which we do not control.</p>
    </LegalPage>
  );
}
