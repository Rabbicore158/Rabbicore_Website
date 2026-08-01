import { buildPlaceholderSvg } from "../src/utils/placeholder.js";
import { saveImage } from "./image-writer.mjs";

const categories = [
  ["living-room", "Living Room"], ["bedroom", "Bedroom"], ["kitchen", "Kitchen"],
  ["bathroom", "Bathroom"], ["dining-room", "Dining Room"], ["office", "Office"],
  ["outdoor", "Outdoor"], ["lighting", "Lighting"],
];

async function run() {
  // Collections
  const collections = [
    ["New Arrivals", "collection-new"],
    ["Best Sellers", "collection-best"],
    ["On Sale", "collection-sale"],
    ["Scandinavian Edit", "collection-scandi"],
    ["Boho Living", "collection-boho"],
    ["Small Space Edit", "collection-small"],
  ];
  for (const [label, seed] of collections) {
    const svg = buildPlaceholderSvg({ label, sub: "Collection", width: 800, height: 600, seed });
    const p = await saveImage(svg, `misc/${seed}.png`);
    console.log(p);
  }

  // Instagram strip
  for (let i = 1; i <= 8; i++) {
    const svg = buildPlaceholderSvg({ label: "RabbiCore", sub: `Inspiration ${i}`, width: 500, height: 500, seed: `instagram-${i}` });
    const p = await saveImage(svg, `misc/instagram-${i}.png`);
    console.log(p);
  }

  // Hero + about
  const heroSvg = buildPlaceholderSvg({ label: "RabbiCore", sub: "Beautiful Homes", width: 1000, height: 860, seed: "rabbicore-hero" });
  console.log(await saveImage(heroSvg, "misc/rabbicore-hero.png"));

  const aboutSvg = buildPlaceholderSvg({ label: "RabbiCore", sub: "About Us", width: 900, height: 760, seed: "about-rabbicore" });
  console.log(await saveImage(aboutSvg, "misc/about-rabbicore.png"));

  // Category fallback images (used as defaults when an admin adds a new
  // product/article from the dashboard without supplying their own image)
  for (const [key, name] of categories) {
    const svg = buildPlaceholderSvg({ label: name, sub: "RabbiCore", width: 900, height: 900, seed: `category-${key}` });
    console.log(await saveImage(svg, `misc/category-${key}.png`));
  }

  const articleFallbackSvg = buildPlaceholderSvg({ label: "RabbiCore", sub: "Decor Ideas", width: 1200, height: 700, seed: "article-generic" });
  console.log(await saveImage(articleFallbackSvg, "misc/article-generic.png"));

  console.log("All misc images generated.");
}

run();
