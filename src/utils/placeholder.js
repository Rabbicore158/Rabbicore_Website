// Builds a branded placeholder image as raw SVG markup. Used only at content
// generation time (see scripts/gen-products.mjs, gen-articles.mjs, and
// gen-images.mjs) to render real PNG files into /public/images. The site
// itself only ever references plain image file paths, never generates
// images at runtime.

const PALETTES = [
  ["#C1502E", "#9C3C21"],
  ["#B08968", "#7A5C3E"],
  ["#8B6F47", "#5A4433"],
  ["#A65D3E", "#7A3F26"],
  ["#AD6A45", "#7F4A2C"],
  ["#C1794F", "#8C5433"],
];

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(text, maxChars) {
  const words = String(text).split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = (cur + " " + w).trim();
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export function buildPlaceholderSvg({ label, sub = "", width = 900, height = 900, seed = "" }) {
  const key = seed || label || "rabbicore";
  const h = hashStr(key);
  const [c1, c2] = PALETTES[h % PALETTES.length];
  const lines = wrapText(label || "RabbiCore", Math.max(8, Math.round(width / 24)));
  const fontSize = Math.round(width * 0.05);
  const lineHeight = Math.round(fontSize * 1.25);
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

  const textEls = lines
    .map(
      (line, i) =>
        `<text x="50%" y="${startY + i * lineHeight}" font-family="Georgia, 'Playfair Display', serif" font-size="${fontSize}" fill="#ffffff" text-anchor="middle" font-weight="600">${escapeXml(line)}</text>`
    )
    .join("");

  const subEl = sub
    ? `<text x="50%" y="${startY + lines.length * lineHeight + fontSize * 0.5}" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.026)}" fill="rgba(255,255,255,0.82)" text-anchor="middle" letter-spacing="2">${escapeXml(String(sub).toUpperCase())}</text>`
    : "";

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c1}"/>
<stop offset="1" stop-color="${c2}"/>
</linearGradient></defs>
<rect width="${width}" height="${height}" fill="url(#g)"/>
<circle cx="${width * 0.86}" cy="${height * 0.14}" r="${width * 0.2}" fill="rgba(255,255,255,0.07)"/>
<circle cx="${width * 0.08}" cy="${height * 0.92}" r="${width * 0.15}" fill="rgba(255,255,255,0.06)"/>
${textEls}
${subEl}
</svg>`;
}
