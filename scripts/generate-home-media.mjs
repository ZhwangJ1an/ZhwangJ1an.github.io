/**
 * generate-home-media.mjs — PHASE 5.1 asset pipeline.
 *
 * Derives the optimized web assets in src/assets/home/ from the raw
 * personal assets in `个人主页 素材/` (machine-local, gitignored — never
 * committed). Run once per source change:
 *
 *     node scripts/generate-home-media.mjs
 *
 * Every output is a measured, art-directed crop — verified visually in
 * qa/ before integration. The raw sources are never modified.
 *
 * Requires the `sharp` dependency that ships with Astro.
 */

import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = path.resolve(import.meta.dirname, '..');
const RAW = path.join(ROOT, '个人主页 素材');
const OUT = path.join(ROOT, 'src', 'assets', 'home');
const TMP = path.join(ROOT, 'qa', 'pdf-preview');

const raw = (name) => {
  const p = path.join(RAW, name);
  if (!existsSync(p)) {
    console.error(`Missing raw asset: ${name}. The raw assets folder is machine-local and gitignored.`);
    process.exit(1);
  }
  return p;
};

async function report(name, file) {
  const { width, height } = await sharp(file).metadata();
  const { size } = await stat(file);
  console.log(
    `${name.padEnd(22)} ${String(width).padStart(5)}x${String(height).padEnd(5)} ${(size / 1024).toFixed(0)}KB`,
  );
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(TMP, { recursive: true });

  /* ---- HERO (source 1920x1080) -----------------------------------------
     Two art-directed crops of the same frame, switched at 56em:
       desktop  x1056 w864  -> 4/5 portrait, person right, lit peak upper-left
       mobile   x480  w1440 -> 4/3 landscape, full peak + person right        */
  await sharp(raw('Hero 主图.jpg'))
    .extract({ left: 1056, top: 0, width: 864, height: 1080 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, 'hero-desktop.jpg'));

  await sharp(raw('Hero 主图.jpg'))
    .extract({ left: 480, top: 0, width: 1440, height: 1080 })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, 'hero-mobile.jpg'));

  /* ---- INSIGHTS FIGURE (vector PDF, rendered locally via poppler) -------
     The PDF is only ever read by pdftoppm, never sent to any model.
     450dpi render -> trim outer whitespace (content only: legend, panels,
     axis labels preserved) -> 24px white padding for breathing room.      */
  const pdf = path.join(RAW, 'Insights 主图.pdf');
  const render = path.join(TMP, 'insights-450.png');
  execFileSync('pdftoppm', ['-png', '-r', '450', '-singlefile', pdf, render.replace(/\.png$/, '')], {
    stdio: 'inherit',
  });

  const trimmed = await sharp(render).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
  await sharp(trimmed.data)
    .extend({
      top: 24,
      bottom: 24,
      left: 24,
      right: 24,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(OUT, 'insights-figure.webp'));
  console.log(`insights figure       trimmed ${trimmed.info.width}x${trimmed.info.height} -> +24px white pad`);

  /* ---- COSLIDE (460x720 UI screenshot, already display-native) ----------
     The source PNG is 38KB at exactly the needed resolution — re-encoding
     lossy would only soften UI text, so it ships as-is.                   */
  await copyFile(raw('CoSlide.png'), path.join(OUT, 'coslide.png'));

  /* ---- CREATIONS (1280x720 browser screenshot) -------------------------- */
  await sharp(raw('Creations.png')).webp({ quality: 90, effort: 6 }).toFile(path.join(OUT, 'creations.webp'));

  /* ---- MOMENTS (huge camera originals -> modest editorial derivatives) -- */
  await sharp(raw('Moments1.jpg')) // summit selfie
    .extract({ left: 261, top: 0, width: 3917, height: 4896 })
    .resize(840, 1050)
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(OUT, 'moments-a.jpg'));

  await sharp(raw('Moments2.jpg')) // airfield
    .extract({ left: 0, top: 350, width: 4096, height: 2560 })
    .resize(1280, 800)
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(OUT, 'moments-b.jpg'));

  await sharp(raw('Moments3.jpg')) // river bend overlook
    .extract({ left: 0, top: 341, width: 4096, height: 2731 })
    .resize(1320, 880)
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(OUT, 'moments-c.jpg'));

  console.log('\nWritten to src/assets/home/:');
  for (const f of [
    'hero-desktop.jpg',
    'hero-mobile.jpg',
    'insights-figure.webp',
    'coslide.png',
    'creations.webp',
    'moments-a.jpg',
    'moments-b.jpg',
    'moments-c.jpg',
  ]) {
    await report(f, path.join(OUT, f));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
