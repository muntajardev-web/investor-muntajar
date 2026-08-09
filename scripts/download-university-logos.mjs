/**
 * Download university logos (256px+) and set logoUrl on each university.
 * Usage: node --env-file=.env scripts/download-university-logos.mjs
 */
import { createWriteStream, existsSync, mkdirSync, unlinkSync, statSync } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "universities");
const force = process.argv.includes("--force");

const DOMAIN_BY_SLUG = {
  "arizona-state-university": "asu.edu",
  "deakin-university": "deakin.edu.au",
  "drexel-university": "drexel.edu",
  "florida-international-university": "fiu.edu",
  "griffith-university": "griffith.edu.au",
  "harvard-university": "harvard.edu",
  "imperial-college-london": "imperial.ac.uk",
  "massachusetts-institute-of-technology": "mit.edu",
  "mcgill-university": "mcgill.ca",
  "monash-university": "monash.edu",
  "stanford-university": "stanford.edu",
  "toronto-metropolitan-university": "torontomu.ca",
  "unsw-sydney": "unsw.edu.au",
  "university-at-buffalo": "buffalo.edu",
  "university-of-adelaide": "adelaide.edu.au",
  "university-of-alberta": "ualberta.ca",
  "university-of-birmingham": "birmingham.ac.uk",
  "university-of-british-columbia": "ubc.ca",
  "university of calgary": "ucalgary.ca",
  "university-of-calgary": "ucalgary.ca",
  "university-of-cambridge": "cam.ac.uk",
  "university-of-glasgow": "gla.ac.uk",
  "university-of-illinois-chicago": "uic.edu",
  "university-of-leeds": "leeds.ac.uk",
  "university-of-manchester": "manchester.ac.uk",
  "university-of-melbourne": "unimelb.edu.au",
  "university-of-oxford": "ox.ac.uk",
  "university-of-sydney": "sydney.edu.au",
  "university-of-toronto": "utoronto.ca",
  "university-of-waterloo": "uwaterloo.ca",
  "york-university": "yorku.ca",
};

/** Explicit high-quality crest URLs when favicons are weak */
const DIRECT_LOGO_BY_SLUG = {
  "imperial-college-london":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Imperial_College_London_new_logo.svg/256px-Imperial_College_London_new_logo.svg.png",
  "harvard-university":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/256px-Harvard_University_coat_of_arms.svg.png",
  "massachusetts-institute-of-technology":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/256px-MIT_logo.svg.png",
  "stanford-university":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/256px-Stanford_Cardinal_logo.svg.png",
  "university-of-oxford":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford_University_Coat_Of_Arms.svg/256px-Oxford_University_Coat_Of_Arms.svg.png",
  "university-of-cambridge":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg/256px-Coat_of_Arms_of_the_University_of_Cambridge.svg.png",
  "university-of-toronto":
    "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Utoronto_coa.svg/256px-Utoronto_coa.svg.png",
  "mcgill-university":
    "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/McGill_University_CoA.svg/256px-McGill_University_CoA.svg.png",
  "university-of-british-columbia":
    "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Ubc_coa.svg/200px-Ubc_coa.svg.png",
  "university-of-melbourne":
    "https://upload.wikimedia.org/wikipedia/en/thumb/1/10/University_of_Melbourne_coat_of_arms.svg/256px-University_of_Melbourne_coat_of_arms.svg.png",
  "university-of-sydney":
    "https://upload.wikimedia.org/wikipedia/en/thumb/8/84/University_of_Sydney_coat_of_arms.svg/256px-University_of_Sydney_coat_of_arms.svg.png",
  "monash-university":
    "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Monash_University_coat_of_arms.svg/256px-Monash_University_coat_of_arms.svg.png",
  "arizona-state-university":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Arizona_State_University_seal.svg/256px-Arizona_State_University_seal.svg.png",
  "florida-international-university":
    "https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Florida_International_University_seal.svg/256px-Florida_International_University_seal.svg.png",
  "university-of-manchester":
    "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/University_of_Manchester.svg/256px-University_of_Manchester.svg.png",
  "university-of-waterloo":
    "https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/University_of_Waterloo_seal.svg/256px-University_of_Waterloo_seal.svg.png",
  "york-university":
    "https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/York_U_coat_of_arms.svg/200px-York_U_coat_of_arms.svg.png",
};

function candidatesFor(slug, domain) {
  const urls = [];
  if (DIRECT_LOGO_BY_SLUG[slug]) urls.push(DIRECT_LOGO_BY_SLUG[slug]);
  urls.push(
    `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
    `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.${domain}&size=256`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  );
  return urls;
}

async function downloadLogo(urls, destPath) {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; MuntajarLogoFetcher/1.0; +https://muntajar.com)",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
        redirect: "follow",
      });
      if (!res.ok || !res.body) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      // Skip near-empty / 1x1 placeholder pixels
      if (buf.byteLength < 800) continue;
      await pipeline(Readable.from(buf), createWriteStream(destPath));
      return { ok: true, bytes: buf.byteLength, source: url };
    } catch {
      // try next
    }
  }
  return { ok: false };
}

const prisma = new PrismaClient();

try {
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const universities = await prisma.university.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  let ok = 0;
  let fail = 0;

  for (const uni of universities) {
    const domain = DOMAIN_BY_SLUG[uni.slug];
    if (!domain) {
      console.warn(`No domain mapped for ${uni.slug}`);
      fail++;
      continue;
    }

    const fileName = `${uni.slug}.png`;
    const destPath = path.join(outDir, fileName);
    const publicPath = `/images/universities/${fileName}`;

    const shouldDownload =
      force ||
      !existsSync(destPath) ||
      statSync(destPath).size < 1500;

    if (shouldDownload) {
      if (existsSync(destPath)) unlinkSync(destPath);
      const result = await downloadLogo(
        candidatesFor(uni.slug, domain),
        destPath,
      );
      if (!result.ok) {
        console.warn(`FAILED ${uni.name} (${domain})`);
        fail++;
        continue;
      }
      console.log(`saved ${uni.name} (${result.bytes}b)`);
    } else {
      console.log(`keep ${uni.name}`);
    }

    await prisma.university.update({
      where: { id: uni.id },
      data: { logoUrl: publicPath },
    });
    ok++;
  }

  console.log(JSON.stringify({ updated: ok, failed: fail }, null, 2));
} finally {
  await prisma.$disconnect();
}
