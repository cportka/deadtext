#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const png2icons = require('png2icons');

const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build');
const webIconsDir = path.join(root, 'src', 'icons');
const svgPath = path.join(buildDir, 'icon.svg');

async function main() {
  fs.mkdirSync(webIconsDir, { recursive: true });
  const svg = fs.readFileSync(svgPath);

  // Master 1024 PNG used by Linux + as the source for ICNS / ICO.
  const png1024 = await sharp(svg).resize(1024, 1024).png().toBuffer();
  fs.writeFileSync(path.join(buildDir, 'icon.png'), png1024);

  const icns = png2icons.createICNS(png1024, png2icons.BILINEAR, 0);
  if (!icns) throw new Error('ICNS generation failed');
  fs.writeFileSync(path.join(buildDir, 'icon.icns'), icns);

  const ico = png2icons.createICO(png1024, png2icons.BILINEAR, 0, false, true);
  if (!ico) throw new Error('ICO generation failed');
  fs.writeFileSync(path.join(buildDir, 'icon.ico'), ico);

  // PWA / web icons.
  await sharp(svg).resize(192, 192).png().toFile(path.join(webIconsDir, 'icon-192.png'));
  await sharp(svg).resize(512, 512).png().toFile(path.join(webIconsDir, 'icon-512.png'));

  // Maskable icon: pad the artwork to 80% of the canvas so it survives
  // platform mask shapes (round, squircle, etc.).
  const inner = await sharp(svg).resize(410, 410).png().toBuffer();
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: '#000000ff' }
  })
    .composite([{ input: inner, gravity: 'center' }])
    .png()
    .toFile(path.join(webIconsDir, 'icon-maskable-512.png'));

  // Favicon — modern browsers honor PNG favicons fine.
  await sharp(svg).resize(64, 64).png().toFile(path.join(webIconsDir, 'favicon.png'));

  console.log('Wrote icons to build/ and src/icons/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
