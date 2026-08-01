import sharp from "sharp";
import fs from "fs";
import path from "path";

const OUT_ROOT = new URL("../public/images/", import.meta.url).pathname;

export async function saveImage(svg, relPath) {
  const outPath = path.join(OUT_ROOT, relPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg)).png({ quality: 82 }).toFile(outPath);
  return `/images/${relPath}`;
}
