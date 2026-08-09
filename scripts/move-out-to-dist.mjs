import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "out");
const distDir = join(root, "dist");

if (!existsSync(outDir)) {
  console.error("Build output folder 'out' not found. Run next build first.");
  process.exit(1);
}

if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}

cpSync(outDir, distDir, { recursive: true });
console.log("Static export copied to dist/");
