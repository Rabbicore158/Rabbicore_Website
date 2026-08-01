import React from "react";
import LegalPage from "../components/LegalPage.jsx";

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="January 2026">
      <p>This Privacy Policy explains how RabbiCore ("we", "us", "our") collects, uses, and protects information when you visit rabbicore.com.</p>

      <h2>Information We Collect</h2>
      <p>We collect information you provide directly, such as your name and email address when you subscribe to our newsletter, contact us, or submit a product suggestion. We also collect limited technical information automatically, such as browser type and pages visited, to help us improve the site.</p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To respond to your inquiries and messages</li>
        <li>To send newsletters and promotional content you've opted into</li>
        <li>To improve our website and product recommendations</li>
        <li>To analyze site usage in aggregate, anonymized form</li>
      </ul>

      <h2>Cookies</h2>
      <p>We use cookies and browser local storage to remember your cart, wishlist, and preferences. See our Cookie Policy for more detail.</p>

      <h2>Third-Party Links</h2>
      <p>Our site contains affiliate links to third-party retailers. We are not responsible for the privacy practices of those sites, so please review their individual privacy policies before making a purchase.</p>

      <h2>Your Choices</h2>
      <p>You can unsubscribe from our newsletter at any time using the link in any email we send. You can also clear your browser's local storage to remove your saved cart and wishlist data.</p>

      <h2>Contact Us</h2>
      <p>If you have questions about this policy, reach out at rabbicore158@gmail.com.</p>
    </LegalPage>
  );
}
