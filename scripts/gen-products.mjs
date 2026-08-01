import fs from "fs";
import { buildPlaceholderSvg } from "../src/utils/placeholder.js";
import { saveImage } from "./image-writer.mjs";

const rooms = [
  { key: "living-room", name: "Living Room", icon: "sofa" },
  { key: "bedroom", name: "Bedroom", icon: "bed" },
  { key: "kitchen", name: "Kitchen", icon: "kitchen" },
  { key: "bathroom", name: "Bathroom", icon: "bath" },
  { key: "dining-room", name: "Dining Room", icon: "dining" },
  { key: "office", name: "Office", icon: "office" },
  { key: "outdoor", name: "Outdoor", icon: "outdoor" },
  { key: "lighting", name: "Lighting", icon: "lighting" },
];

const styles = ["Modern", "Rustic", "Boho", "Minimalist", "Vintage", "Coastal", "Scandinavian", "Industrial", "Farmhouse", "Mid-Century"];
const materials = ["Solid Oak Wood", "Rattan & Wicker", "Powder-Coated Iron", "Linen & Cotton Blend", "Reclaimed Pine", "Brushed Brass", "Ceramic Stoneware", "Bamboo", "Walnut Veneer", "Recycled Glass"];
const colors = ["Cream", "Terracotta", "Charcoal", "Sage Green", "Warm Walnut", "Ivory", "Dusty Rose", "Natural Beige", "Slate Grey", "Amber"];

const templates = {
  "living-room": ["Sofa", "Loveseat", "Accent Chair", "Coffee Table", "TV Stand", "Bookshelf", "Area Rug", "Throw Pillow Set", "Wall Art Set", "Floor Lamp", "Console Table", "Curtain Panel", "Ottoman", "Sectional Sofa", "Side Table", "Media Console", "Wall Mirror"],
  "bedroom": ["Platform Bed Frame", "Nightstand", "Dresser", "Wardrobe", "Duvet Cover Set", "Reading Chair", "Vanity Table", "Storage Bench", "Headboard", "Blanket Ladder", "Jewelry Organizer", "Bedside Lamp", "Bedroom Bench", "Full-Length Mirror"],
  "kitchen": ["Bar Stool", "Kitchen Island Cart", "Utensil Crock", "Spice Rack", "Cutting Board Set", "Pot Rack", "Dish Towel Set", "Fruit Bowl", "Canister Set", "Wine Rack", "Kitchen Runner Rug", "Pantry Shelving Unit", "Napkin Holder"],
  "bathroom": ["Vanity Mirror", "Towel Ladder", "Shower Curtain", "Bath Mat", "Storage Cart", "Soap Dispenser Set", "Wall Shelf", "Laundry Hamper", "Toothbrush Holder", "Bathroom Cabinet", "Shower Caddy", "Corner Shelf Unit"],
  "dining-room": ["Dining Table", "Dining Chair Set", "Buffet Cabinet", "Table Runner", "Pendant Light", "China Cabinet", "Placemat Set", "Centerpiece Bowl", "Dining Bench", "Wine Cabinet", "Bar Cart"],
  "office": ["Desk", "Office Chair", "Bookcase", "Desk Organizer", "Filing Cabinet", "Desk Lamp", "Monitor Stand", "Task Chair", "Cork Board", "Storage Ottoman", "Standing Desk Converter"],
  "outdoor": ["Patio Sofa Set", "Outdoor Rug", "Garden Planter", "String Lights", "Hammock", "Patio Umbrella", "Outdoor Cushion Set", "Fire Pit Table", "Garden Bench", "Outdoor Lantern", "Adirondack Chair", "Trellis Planter Box"],
  "lighting": ["Floor Lamp", "Table Lamp", "Pendant Light", "Chandelier", "Wall Sconce", "String Light Set", "Desk Lamp", "Ceiling Flush Mount", "Rattan Lamp Shade", "LED Strip Kit", "Picture Light"],
};

const descIntros = [
  "Bring understated elegance into your space with this",
  "Crafted for everyday comfort, this",
  "A quiet statement piece, this",
  "Designed to warm up any room, this",
  "Blending form and function, this",
  "Made to last through every season, this",
  "A favorite among our customers, this",
  "Thoughtfully designed for small and large spaces alike, this",
];

const descBodies = [
  "combines natural textures with clean lines for a look that feels curated, not cluttered.",
  "is finished by hand, so no two pieces are exactly alike.",
  "pairs easily with existing furniture, making it simple to refresh a room without starting over.",
  "was built with sustainably sourced materials that age beautifully over time.",
  "adds warmth and texture without overwhelming the rest of your decor.",
  "is the kind of piece that quietly pulls a whole room together.",
  "was designed with everyday use in mind, sturdy, comfortable, and easy to care for.",
  "brings a boutique-hotel feel to your home at a fraction of the price.",
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick(arr, rnd) {
  return arr[Math.floor(rnd() * arr.length)];
}

function slugify(str) {
  return str.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

let products = [];
let idCounter = 1;

for (const [rIdx, room] of rooms.entries()) {
  const items = templates[room.key];
  for (const [iIdx, item] of items.entries()) {
    const rnd = seededRandom(rIdx * 97 + iIdx * 13 + 7);
    const style = pick(styles, rnd);
    const material = pick(materials, rnd);
    const color = pick(colors, rnd);
    const name = `${style} ${item}`;
    const slug = slugify(`${name}-${room.key}-${idCounter}`);
    const basePrice = Math.round((29 + rnd() * 470) * 100) / 100;
    const onSale = rnd() > 0.65;
    const price = onSale ? Math.round(basePrice * 0.8 * 100) / 100 : basePrice;
    const rating = Math.round((3.6 + rnd() * 1.4) * 10) / 10;
    const reviews = Math.floor(12 + rnd() * 480);
    const isNew = rnd() > 0.8;
    const isBestseller = !isNew && rnd() > 0.75;

    const intro = pick(descIntros, rnd);
    const body1 = pick(descBodies, rnd);
    const body2 = pick(descBodies, rnd);

    const description = `${intro} ${item.toLowerCase()} ${body1} Made from ${material.toLowerCase()}, it ${body2} Available in ${color.toLowerCase()}, it's a versatile addition to any ${room.name.toLowerCase()}.`;

    const features = [
      `Premium ${material.toLowerCase()} construction`,
      `${style} silhouette that suits most decor styles`,
      "Easy at-home assembly with included hardware",
      "Designed for everyday durability",
      onSale ? "Limited-time price, while supplies last" : "Consistently one of our top-rated picks",
    ];

    const dims = `${Math.floor(12 + rnd() * 60)}"W x ${Math.floor(12 + rnd() * 40)}"D x ${Math.floor(10 + rnd() * 40)}"H`;
    const weight = `${Math.floor(4 + rnd() * 80)} lbs`;

    const svg = buildPlaceholderSvg({ label: name, sub: room.name, width: 900, height: 900, seed: slug });
    const mainImage = await saveImage(svg, `products/${slug}.png`);

    products.push({
      id: idCounter,
      slug,
      name,
      category: room.key,
      categoryName: room.name,
      price,
      originalPrice: onSale ? basePrice : null,
      onSale,
      rating,
      reviews,
      isNew,
      isBestseller,
      images: [mainImage, mainImage, mainImage, mainImage],
      description,
      features,
      specs: {
        Material: material,
        Color: color,
        Dimensions: dims,
        Weight: weight,
        Assembly: rnd() > 0.5 ? "Required (tools included)" : "No assembly required",
        Style: style,
      },
      affiliateUrl: `https://www.amazon.com/s?k=${encodeURIComponent(name)}`,
    });
    idCounter++;
  }
}

fs.writeFileSync(
  new URL("../src/data/products.js", import.meta.url),
  `// Auto-generated product catalog (${products.length} products)\nexport const products = ${JSON.stringify(products, null, 2)};\n`
);

console.log(`Generated ${products.length} products`);
