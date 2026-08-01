import { mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FORCE = process.argv.includes("--force");
const CONCURRENCY = 5;

const PRODUCT_TAGS = {
  1: "sofa", 2: "loveseat", 3: "armchair", 4: "coffee-table", 5: "console", 6: "bookshelf",
  7: "rug", 8: "pillows", 9: "wall-art", 10: "floor-lamp", 11: "console-table", 12: "curtains",
  13: "ottoman", 14: "sofa", 15: "side-table", 16: "console", 17: "mirror",
  18: "bedroom", 19: "nightstand", 20: "dresser", 21: "wardrobe", 22: "bedroom", 23: "armchair",
  24: "vanity", 25: "bench", 26: "bedroom", 27: "blanket", 28: "jewelry", 29: "bedside-lamp",
  30: "bench", 31: "mirror",
  32: "bar-stool", 33: "kitchen", 34: "kitchen", 35: "spice", 36: "cutting-board", 37: "kitchen",
  38: "towel", 39: "fruit", 40: "kitchen", 41: "wine", 42: "rug", 43: "shelf", 44: "kitchen",
  45: "mirror", 46: "towel", 47: "shower", 48: "bathroom", 49: "storage", 50: "bathroom",
  51: "shelf", 52: "laundry", 53: "bathroom", 54: "bathroom", 55: "shower", 56: "shelf",
  57: "dining-table", 58: "dining", 59: "buffet", 60: "dining", 61: "pendant-light", 62: "cabinet",
  63: "dining", 64: "bowl", 65: "dining", 66: "wine", 67: "bar-cart",
  68: "desk", 69: "office-chair", 70: "bookcase", 71: "desk", 72: "cabinet", 73: "desk-lamp",
  74: "desk", 75: "office-chair", 76: "cork", 77: "ottoman", 78: "desk",
  79: "patio", 80: "rug", 81: "planter", 82: "string-lights", 83: "hammock", 84: "umbrella",
  85: "cushions", 86: "fire-pit", 87: "bench", 88: "lantern", 89: "chair", 90: "planter",
  91: "floor-lamp", 92: "table-lamp", 93: "pendant-light", 94: "chandelier", 95: "sconce",
  96: "string-lights", 97: "desk-lamp", 98: "ceiling-lamp", 99: "lamp-shade", 100: "led-lights",
  101: "lamp",
};

const CATEGORY_TAGS = {
  "living-room": "livingroom",
  bedroom: "bedroom",
  kitchen: "kitchen",
  bathroom: "bathroom",
  "dining-room": "dining",
  office: "office",
  outdoor: "garden",
  lighting: "lighting",
};

const MISC = [
  { file: "rabbicore-hero", tags: "livingroom,interior", w: 1200, h: 1000, lock: 10 },
  { file: "about-rabbicore", tags: "interior,home", w: 900, h: 760, lock: 11 },
  { file: "article-generic", tags: "interior,home", w: 1200, h: 700, lock: 12 },
  { file: "category-living-room", tags: "livingroom", w: 800, h: 800, lock: 13 },
  { file: "category-bedroom", tags: "bedroom", w: 800, h: 800, lock: 14 },
  { file: "category-kitchen", tags: "kitchen", w: 800, h: 800, lock: 15 },
  { file: "category-bathroom", tags: "bathroom", w: 800, h: 800, lock: 16 },
  { file: "category-dining-room", tags: "dining", w: 800, h: 800, lock: 17 },
  { file: "category-office", tags: "office", w: 800, h: 800, lock: 18 },
  { file: "category-outdoor", tags: "garden", w: 800, h: 800, lock: 19 },
  { file: "category-lighting", tags: "lamp", w: 800, h: 800, lock: 20 },
  { file: "collection-new", tags: "livingroom,interior", w: 800, h: 600, lock: 21 },
  { file: "collection-best", tags: "interior,home", w: 800, h: 600, lock: 22 },
  { file: "collection-sale", tags: "interior,decor", w: 800, h: 600, lock: 23 },
  { file: "collection-scandi", tags: "scandinavian,interior", w: 800, h: 600, lock: 24 },
  { file: "collection-boho", tags: "boho,interior", w: 800, h: 600, lock: 25 },
  { file: "collection-small", tags: "apartment,interior", w: 800, h: 600, lock: 26 },
  { file: "instagram-1", tags: "livingroom", w: 500, h: 500, lock: 27 },
  { file: "instagram-2", tags: "decor", w: 500, h: 500, lock: 28 },
  { file: "instagram-3", tags: "bedroom", w: 500, h: 500, lock: 29 },
  { file: "instagram-4", tags: "kitchen", w: 500, h: 500, lock: 30 },
  { file: "instagram-5", tags: "garden", w: 500, h: 500, lock: 31 },
  { file: "instagram-6", tags: "lighting", w: 500, h: 500, lock: 32 },
  { file: "instagram-7", tags: "interior", w: 500, h: 500, lock: 33 },
  { file: "instagram-8", tags: "plants", w: 500, h: 500, lock: 34 },
];

const ARTICLE_TAG = (cat) =>
  ({
    "Living Room": "livingroom",
    Bedroom: "bedroom",
    Kitchen: "kitchen",
    Bathroom: "bathroom",
    "Dining Room": "dining",
    Office: "office",
    Outdoor: "garden",
    Lighting: "lighting",
  }[cat] || "interior");

let done = 0;
let total = 0;
const failed = [];

async function fetchWithRetry(url, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (RabbiCore image fetch)" },
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(buf).metadata();
      if (!meta.format || !meta.width || !meta.height) throw new Error("Not an image");
      return buf;
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 1200 * (i + 1)));
    }
  }
}

async function fetchOne({ dest, tags, w, h, lock, label }) {
  if (!FORCE && existsSync(dest)) {
    done += 1;
    console.log(`[${done}/${total}] skip ${label}`);
    return true;
  }
  const url = `https://loremflickr.com/${w}/${h}/${encodeURIComponent(tags)}?lock=${lock}`;
  try {
    const buf = await fetchWithRetry(url);
    await sharp(buf).resize(w, h, { fit: "cover", withoutEnlargement: true }).webp({ quality: 72 }).toFile(dest);
    done += 1;
    console.log(`[${done}/${total}] ok   ${label}`);
    return true;
  } catch (err) {
    failed.push({ label, url, err: err.message });
    done += 1;
    console.log(`[${done}/${total}] FAIL ${label} — ${err.message}`);
    return false;
  }
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const productsSrc = await readFile(resolve(ROOT, "src/data/products.js"), "utf8");
  const articlesSrc = await readFile(resolve(ROOT, "src/data/articles.js"), "utf8");

  const productsMatch = productsSrc.match(/\[[\s\S]*\]/);
  const articlesMatch = articlesSrc.match(/\[[\s\S]*\]/);
  if (!productsMatch || !articlesMatch) throw new Error("Could not parse data files");

  const products = JSON.parse(productsMatch[0]);
  const articles = JSON.parse(articlesMatch[0]);

  await mkdir(resolve(ROOT, "public/images/products"), { recursive: true });
  await mkdir(resolve(ROOT, "public/images/articles"), { recursive: true });
  await mkdir(resolve(ROOT, "public/images/misc"), { recursive: true });

  const jobs = [];

  for (const p of products) {
    jobs.push({
      dest: resolve(ROOT, `public/images/products/${p.slug}.webp`),
      tags: `${PRODUCT_TAGS[p.id] || "interior"},${CATEGORY_TAGS[p.category] || "interior"}`,
      w: 800,
      h: 800,
      lock: p.id % 500,
      label: `product ${p.id} (${p.slug})`,
    });
  }

  for (const a of articles) {
    jobs.push({
      dest: resolve(ROOT, `public/images/articles/article-${a.id}.webp`),
      tags: `${ARTICLE_TAG(a.category)},interior`,
      w: 1200,
      h: 700,
      lock: 400 + a.id,
      label: `article ${a.id} (${a.category})`,
    });
  }

  for (const m of MISC) {
    jobs.push({
      dest: resolve(ROOT, `public/images/misc/${m.file}.webp`),
      tags: m.tags,
      w: m.w,
      h: m.h,
      lock: m.lock,
      label: `misc ${m.file}`,
    });
  }

  total = jobs.length;
  console.log(`Downloading ${total} images from loremflickr...\n`);
  await mapLimit(jobs, CONCURRENCY, fetchOne);

  console.log(`\nFinished. ${total - failed.length}/${total} succeeded.`);
  if (failed.length) {
    console.log("Failed:");
    for (const f of failed) console.log(`  - ${f.label}: ${f.err} (${f.url})`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
