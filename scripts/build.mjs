import { cp, mkdir, rm } from "node:fs/promises";

const outputDirectory = new URL("../dist/", import.meta.url);
const staticPaths = [
  "index.html",
  "favicon.png",
  "assets",
  "images",
  "_redirects",
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const staticPath of staticPaths) {
  await cp(
    new URL(`../${staticPath}`, import.meta.url),
    new URL(staticPath, outputDirectory),
    { recursive: true },
  );
}
