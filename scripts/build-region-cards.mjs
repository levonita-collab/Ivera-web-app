// One-off build script for IVERA region card assets.
// Generates /public/assets/regions/{slug}-card.webp and {slug}-card-poster.jpg
// from real source photography, with a shared cinematic grade:
// deep indigo shadow gradient (bottom, for text legibility) + soft gold glow accent.
import sharp from "sharp";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public/assets/regions");

const CARD_W = 1200;
const CARD_H = 900;

// Deep indigo shadow gradient (bottom 60%) for overlay text legibility.
const indigoGradient = `
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#15122B" stop-opacity="0"/>
      <stop offset="42%" stop-color="#15122B" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0E0C1E" stop-opacity="0.82"/>
    </linearGradient>
    <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0E0C1E" stop-opacity="0.30"/>
      <stop offset="22%" stop-color="#0E0C1E" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${CARD_W}" height="${CARD_H}" fill="url(#g)"/>
  <rect width="${CARD_W}" height="${CARD_H}" fill="url(#top)"/>
</svg>`;

// Soft metallic gold glow, top-right — subtle "quest unlock" accent.
const goldGlow = `
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}">
  <defs>
    <radialGradient id="glow" cx="82%" cy="14%" r="55%">
      <stop offset="0%" stop-color="#E8C468" stop-opacity="0.40"/>
      <stop offset="55%" stop-color="#C89B3C" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#C89B3C" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${CARD_W}" height="${CARD_H}" fill="url(#glow)"/>
</svg>`;

// Full-frame "day-for-dusk" cinematic cast: indigo shadows top-left, gold highlights
// bottom-right — unifies the three source photos into one premium quest visual DNA.
const cinematicCast = `
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}">
  <defs>
    <linearGradient id="cast" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#211C42" stop-opacity="0.40"/>
      <stop offset="48%" stop-color="#3A2E55" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#C89B3C" stop-opacity="0.22"/>
    </linearGradient>
  </defs>
  <rect width="${CARD_W}" height="${CARD_H}" fill="url(#cast)"/>
</svg>`;

const REGIONS = [
  {
    slug: "kakheti",
    src: "public/images/tours/kakheti-wine-legends.jpg",
    // Hilltop town of Sighnaghi over the Alazani valley — real Kakheti wine-region identity.
    crop: { left: 0, top: 0, width: 1500, height: 925 },
    modulate: { saturation: 1.12, brightness: 1.02, hue: 6 }, // push toward warm golden-hour
  },
  {
    slug: "kazbegi",
    src: "public/images/hero-gergeti.jpg",
    // Gergeti Trinity Church above the clouds with Mt Kazbek — already epic, minimal grading.
    crop: { left: 0, top: 0, width: 1376, height: 768 },
    modulate: { saturation: 1.05, brightness: 0.98, hue: 0 },
  },
  {
    slug: "tbilisi",
    src: "public/images/tours/tbilisi-city-quest.jpg",
    // Crop to the Abanotubani sulfur-bath tilework + carved balconies, no people.
    crop: { left: 0, top: 0, width: 1500, height: 900 },
    modulate: { saturation: 1.1, brightness: 1.0, hue: 4 },
  },
];

const indigoBuf = Buffer.from(indigoGradient);
const goldBuf = Buffer.from(goldGlow);
const castBuf = Buffer.from(cinematicCast);

for (const region of REGIONS) {
  const srcPath = path.join(ROOT, region.src);

  const base = sharp(srcPath)
    .extract(region.crop)
    .resize(CARD_W, CARD_H, { fit: "cover" })
    .modulate(region.modulate)
    .linear(1.04, -6); // gentle contrast lift for cinematic punch

  const graded = base
    .clone()
    .composite([
      { input: castBuf, blend: "soft-light" },
      { input: goldBuf, blend: "soft-light" },
      { input: indigoBuf, blend: "over" },
    ]);

  const webpOut = path.join(OUT_DIR, `${region.slug}-card.webp`);
  const jpgOut = path.join(OUT_DIR, `${region.slug}-card-poster.jpg`);

  await graded.clone().webp({ quality: 80 }).toFile(webpOut);
  await graded.clone().jpeg({ quality: 68, mozjpeg: true }).toFile(jpgOut);

  console.log(`✓ ${region.slug}: ${webpOut}, ${jpgOut}`);
}
