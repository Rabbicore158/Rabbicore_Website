# RabbiCore, Home Decor and Affiliate Storefront

A full, responsive, animated home decor storefront with a client-side admin dashboard.
This is a standard Vite + React project.

## Running it

You need Node.js installed (v18 or newer). Then, from this folder:

```
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:3000`). That's it.

To build a production version (for hosting):
```
npm run build
```
This creates a `dist` folder you can deploy anywhere. To preview that build locally:
```
npm run preview
```

## Deploying to Vercel

1. Push this project to GitHub (as you've already done).
2. In Vercel, import the repo.
3. Framework preset: Vite (Vercel should auto-detect this).
4. Leave Build Command and Output Directory on their defaults (npm run build and dist).
   Vercel's Vite preset already knows these.
5. Deploy. You'll get a live URL.

## Admin dashboard

Visit /admin/login. Demo admin accounts:

| Username | Password |
|---|---|
| Rabbicore01 | Rabbicore@01 |
| Rabbicore02 | Rabbicore@02 |
| Rabbicore03 | Rabbicore@03 |
| Rabbicore04 | Rabbicore@04 |
| Rabbicore05 | Rabbicore@05 |

A Super Admin account also exists with elevated permissions (can add or remove other admins).
Its username is intentionally not printed anywhere in this file or the app itself, by design.
Only you have it.

From the dashboard, any admin can:
- Add, edit, or delete any product
- Add, edit, or delete any article (with a rich text editor)
- Manage collections, homepage section visibility, and site settings
- (Super Admin only) add or remove other admin accounts

Good to know: this is a front-end-only build with no server or database. Admin changes save
to your browser's local storage, so they:
- stay saved between visits, in that same browser
- do not sync across different browsers or devices
- will disappear if that browser's site data or local storage is cleared

This also means the login is a demo-level pattern, not real production security. For a real
admin panel handling actual customer data, that logic should move to a real backend with hashed
passwords and proper sessions.

## Images

Every product photo, article header, and collection banner is a real, pre-generated PNG file
living in public/images/ (a clean branded color card with the product or article name on it)
rather than a stock photo. This is intentional. They are ordinary static image files, so they
load instantly with no external dependency and nothing will ever show up as broken or slow.

- public/images/products/     one image per product
- public/images/articles/     one hero image per article
- public/images/misc/         collections, homepage hero, about page, and admin default images

When you have real product photography, replace the images field for a product (or heroImage
for an article) with your real photo, either directly in src/data/products.js and
src/data/articles.js, or through the Admin, Products, Articles, and Media screens. You can put
your own photos anywhere under public/ and reference them the same way (for example,
public/images/products/my-sofa.jpg becomes /images/products/my-sofa.jpg).

## Forms

The newsletter, contact, and product suggestion forms are wired to Formspree. They will start
working the moment the site is live on the internet (Formspree needs a real, publicly
reachable page to receive submissions from).

## Checkout

RabbiCore is an affiliate storefront, not a payment processor. "Buy on Amazon" buttons link out
to Amazon search results for each product name. Before publishing, update affiliateUrl in
src/data/products.js with your real Amazon Associates links, including your tracking tag.

## Editing content directly in code

- Products: src/data/products.js (regenerate with npm run gen:products)
- Articles: src/data/articles.js (regenerate with npm run gen:articles)

Regenerating products or articles creates new placeholder images too, which needs one extra
package not installed by default (it is only needed for this, not for running the site):
```
npm install sharp --save-dev
```
- Site text, testimonials, FAQs, contact info defaults: src/data/site.js and
  src/context/AppContext.jsx (the settings default)
- Colors, fonts, spacing: CSS variables at the top of src/styles/main.css

## Project structure

```
index.html               Vite entry HTML
vite.config.js            Vite config
src/
  main.jsx                React entry point
  App.jsx                  Routes
  utils/router.jsx         Lightweight built-in router (no external routing library needed)
  utils/placeholder.js     Generates the branded placeholder images
  context/AppContext.jsx   Cart, wishlist, auth, and admin-editable site data
  data/                    Product, article, and site content
  components/              Shared UI (Navbar, Footer, cards, forms, etc.)
  pages/                   One file per page
  pages/admin/             Admin dashboard pages
  styles/main.css          All styling and animations
public/                   Logo, favicon
scripts/                  Content generator scripts
```
