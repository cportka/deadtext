#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const png2icons = require('png2icons');

const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build');
const svgPath = path.join(buildDir, 'icon.svg');

async function main() {
  const svg = fs.readFileSync(svgPath);
  const png1024 = await sharp(svg).resize(1024, 1024).png().toBuffer();
  fs.writeFileSync(path.join(buildDir, 'icon.png'), png1024);

  const icns = png2icons.createICNS(png1024, png2icons.BILINEAR, 0);
  if (!icns) throw new Error('ICNS generation failed');
  fs.writeFileSync(path.join(buildDir, 'icon.icns'), icns);

  const ico = png2icons.createICO(png1024, png2icons.BILINEAR, 0, false, true);
  if (!ico) throw new Error('ICO generation failed');
  fs.writeFileSync(path.join(buildDir, 'icon.ico'), ico);

  console.log('Wrote build/icon.png, build/icon.icns, build/icon.ico');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
