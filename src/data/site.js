export const categories = [
  { key: "living-room", name: "Living Room", icon: "sofa" },
  { key: "bedroom", name: "Bedroom", icon: "bed" },
  { key: "kitchen", name: "Kitchen", icon: "kitchen" },
  { key: "bathroom", name: "Bathroom", icon: "bath" },
  { key: "dining-room", name: "Dining Room", icon: "dining" },
  { key: "office", name: "Office", icon: "office" },
  { key: "outdoor", name: "Outdoor", icon: "outdoor" },
  { key: "lighting", name: "Lighting", icon: "lighting" },
];

export const collections = [
  { key: "new-arrivals", name: "New Arrivals", desc: "The latest additions to our catalog, added weekly.", image: "/images/misc/collection-new.webp" },
  { key: "best-sellers", name: "Best Sellers", desc: "Our most-loved pieces, based on real customer ratings.", image: "/images/misc/collection-best.webp" },
  { key: "on-sale", name: "On Sale", desc: "Limited-time markdowns across every room.", image: "/images/misc/collection-sale.webp" },
  { key: "scandinavian-edit", name: "Scandinavian Edit", desc: "Light woods, soft neutrals, and clean lines.", image: "/images/misc/collection-scandi.webp" },
  { key: "boho-living", name: "Boho Living", desc: "Rattan, warm textures, and relaxed silhouettes.", image: "/images/misc/collection-boho.webp" },
  { key: "small-space-edit", name: "Small Space Edit", desc: "Space-smart pieces for apartments and cozy rooms.", image: "/images/misc/collection-small.webp" },
];

export const testimonials = [
  { name: "Sarah Johnson", location: "Austin, TX", rating: 5, text: "RabbiCore completely changed how I think about my living room. The accent chair I bought is even better in person, and the buying guide helped me pick the right size rug for the first time in my life." },
  { name: "Michael Brown", location: "Denver, CO", rating: 5, text: "I've redone my whole home office based on ideas from this site. The desk organization article alone saved me from buying three things I didn't actually need." },
  { name: "Emily Davis", location: "Portland, OR", rating: 4, text: "Great range of styles and the product descriptions are genuinely useful. Dimensions and materials are listed clearly, which a lot of decor sites skip." },
  { name: "James Wilson", location: "Chicago, IL", rating: 5, text: "The kitchen organization guide is the most practical decor article I've read anywhere. Implemented four of the ideas in one weekend." },
  { name: "Olivia Martinez", location: "Miami, FL", rating: 5, text: "Ordered a rattan accent chair and it arrived exactly as pictured. The related-articles section pointed me to a styling guide that was genuinely helpful." },
  { name: "Daniel Lee", location: "Seattle, WA", rating: 4, text: "Love the mix of shoppable products and real editorial content. Most home decor sites are one or the other." },
];

export const instagramStrip = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  image: `/images/misc/instagram-${i + 1}.webp`,
}));

// Client-side admin accounts. NOTE: this is a static front-end demo login.
// see the project README for why this is not appropriate for a real production admin panel.
export const adminAccounts = [
  { username: "Rabbicore01", password: "Rabbicore@01", role: "admin", label: "Admin 01", avatar: "\u{1F9D1}\u200D\u{1F4BC}" },
  { username: "Rabbicore02", password: "Rabbicore@02", role: "admin", label: "Admin 02", avatar: "\u{1F469}\u200D\u{1F4BC}" },
  { username: "Rabbicore03", password: "Rabbicore@03", role: "admin", label: "Admin 03", avatar: "\u{1F468}\u200D\u{1F3A8}" },
  { username: "Rabbicore04", password: "Rabbicore@04", role: "admin", label: "Admin 04", avatar: "\u{1F469}\u200D\u{1F4BB}" },
  { username: "Rabbicore05", password: "Rabbicore@05", role: "admin", label: "Admin 05", avatar: "\u{1F468}\u200D\u{1F4BB}" },
  { username: "ZohaibMzg", password: "Zohaib@0158", role: "superadmin", label: "Super Admin", avatar: "\u{1F9D9}" },
];

// Pool of avatar emojis assigned (by simple hash) to any admin added later via the dashboard.
export const avatarPool = ["\u{1F9D1}\u200D\u{1F4BC}", "\u{1F469}\u200D\u{1F4BC}", "\u{1F468}\u200D\u{1F3A8}", "\u{1F469}\u200D\u{1F4BB}", "\u{1F468}\u200D\u{1F4BB}", "\u{1F469}\u200D\u{1F527}", "\u{1F468}\u200D\u{1F52C}", "\u{1F9D1}\u200D\u{1F373}"];

export const faqs = [
  { q: "Do you ship internationally?", a: "We work with affiliate retail partners who each set their own shipping policies. Check the specific retailer's shipping details on the product page before you buy." },
  { q: "How do I know a product will fit my space?", a: "Every product page lists full dimensions under the Specs tab. We recommend measuring your space and marking it with tape before ordering any large furniture piece." },
  { q: "Are your product recommendations sponsored?", a: "We participate in affiliate programs, meaning we may earn a commission on purchases made through our links, at no extra cost to you. See our Affiliate Disclosure for full details." },
  { q: "Can I suggest a product for you to feature?", a: "Yes, use the Product Suggestion form linked in our footer. We review every submission." },
  { q: "How often do you publish new articles?", a: "We publish new decor ideas and buying guides regularly. Subscribe to our newsletter to get notified." },
  { q: "Do you offer interior design consultations?", a: "Not at this time. Our focus is curated product recommendations and free how-to guides." },
  { q: "How do I return a product I bought through your link?", a: "Since purchases are completed on the retailer's site, returns are handled directly by that retailer according to their own policy." },
  { q: "How do I create a wishlist?", a: "Click the heart icon on any product card or product page. Your wishlist is saved in your browser so it's there next time you visit." },
];
