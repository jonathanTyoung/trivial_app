#!/usr/bin/env node
// Generates assets/icon.png, assets/adaptive-icon.png, and assets/splash.png.
//
// Requires sharp, which is intentionally not in package.json:
//   npm install --no-save --legacy-peer-deps sharp
//   node scripts/make-icon.js

const path = require('path');
const sharp = require('sharp');

const BG = '#0e0e0e';
const FG = '#f5f5f0';
const DIM = '#555550';
const FONT = "-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const ARC_FRACTION = 0.6; // 60% complete
const START_DEG = -90; // 12 o'clock, sweeping clockwise

/**
 * @param {object} spec
 * @param {number} spec.size            canvas width/height in px
 * @param {number} spec.cx              ring center x
 * @param {number} spec.cy              ring center y
 * @param {number} spec.r               ring radius (to stroke center)
 * @param {number} spec.stroke          stroke width
 * @param {number} [spec.dotR]          endpoint dot radius (default 1.1 × stroke)
 * @param {{ size: number, y: number }} [spec.wordmark]  baseline y for "trivial"
 */
function buildSvg({ size, cx, cy, r, stroke, dotR = stroke * 1.1, wordmark }) {
  const sweep = 360 * ARC_FRACTION;
  const endDeg = START_DEG + sweep;
  const toXY = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [sx, sy] = toXY(START_DEG);
  const [ex, ey] = toXY(endDeg);
  const largeArc = sweep > 180 ? 1 : 0;

  const text = wordmark
    ? `<text x="${cx}" y="${wordmark.y}" text-anchor="middle" font-family="${FONT}"
          font-size="${wordmark.size}" font-weight="400" fill="${DIM}">trivial</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <path d="M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}"
        fill="none" stroke="${FG}" stroke-width="${stroke}" stroke-linecap="round"/>
  <circle cx="${ex}" cy="${ey}" r="${dotR}" fill="${FG}"/>
  ${text}
</svg>`;
}

async function render(spec, outFile) {
  const info = await sharp(Buffer.from(buildSvg(spec)), { density: 300 })
    .resize(spec.size, spec.size)
    .flatten({ background: BG })
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(outFile);
  console.log(`wrote ${path.relative(process.cwd(), outFile)} ${info.width}x${info.height} (${info.channels}ch)`);
}

function iconSpec() {
  const size = 1024;
  const r = size * 0.25;
  const stroke = size * 0.04;
  const cy = size * 0.43;
  return {
    size, cx: size / 2, cy, r, stroke,
    wordmark: { size: size * 0.115, y: cy + r + stroke + size * 0.175 },
  };
}

// Android crops this to circles, squircles, etc. Everything stays inside the
// inner 66% (radius 0.33 × size from center): outer extent = r + dotR = 0.317 × size.
function adaptiveIconSpec() {
  const size = 1024;
  const stroke = size * 0.043;
  return { size, cx: size / 2, cy: size / 2, r: size * 0.27, stroke };
}

// Ring about 300px across, wordmark about 48px, group nudged up so it reads as centered.
function splashSpec() {
  const size = 2048;
  const r = 138;
  const stroke = 22;
  const dotR = 24;
  const cy = size / 2 - 30;
  return {
    size, cx: size / 2, cy, r, stroke, dotR,
    wordmark: { size: 48, y: cy + r + dotR + 88 },
  };
}

async function main() {
  const assets = path.resolve(__dirname, '..', 'assets');
  await render(iconSpec(), path.join(assets, 'icon.png'));
  await render(adaptiveIconSpec(), path.join(assets, 'adaptive-icon.png'));
  await render(splashSpec(), path.join(assets, 'splash.png'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
