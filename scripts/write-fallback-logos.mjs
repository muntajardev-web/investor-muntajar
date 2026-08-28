import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "images", "universities");
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const marks = [
  { slug: "imperial-college-london", color: "#003E74", label: "IC" },
  { slug: "griffith-university", color: "#C8102E", label: "GU" },
];

function svgFor({ color, label }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img">
  <rect width="128" height="128" rx="28" fill="${color}"/>
  <text x="64" y="78" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="44" fill="#ffffff">${label}</text>
</svg>`;
}

const prisma = new PrismaClient();
try {
  for (const m of marks) {
    const file = `${m.slug}.svg`;
    writeFileSync(path.join(dir, file), svgFor(m));
    const publicPath = `/images/universities/${file}`;
    await prisma.university.updateMany({
      where: { slug: m.slug },
      data: { logoUrl: publicPath },
    });
    console.log("wrote", publicPath);
  }
} finally {
  await prisma.$disconnect();
}
