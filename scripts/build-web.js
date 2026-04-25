#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const src = path.join(root, 'src');
const landing = path.join(root, 'landing');
const out = path.join(root, 'dist-web');
const appOut = path.join(out, 'app');

const buildId = process.env.GITHUB_SHA
  ? process.env.GITHUB_SHA.slice(0, 12)
  : crypto.randomBytes(6).toString('hex');

function rmRf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyTree(a, b);
    } else if (entry.isFile()) {
      fs.copyFileSync(a, b);
    }
  }
}

rmRf(out);

// 1. Landing page at the root.
copyTree(landing, out);

// 2. Reuse the icons from src/ for the landing too — keeps the favicon and
//    apple-touch-icon working without duplicating files in the repo.
copyTree(path.join(src, 'icons'), path.join(out, 'icons'));

// 3. The full PWA app under /app/.
copyTree(src, appOut);

// 4. Stamp the service worker with the build ID for cache busting.
const swPath = path.join(appOut, 'sw.js');
if (fs.existsSync(swPath)) {
  const sw = fs.readFileSync(swPath, 'utf8').replace(/__BUILD_ID__/g, buildId);
  fs.writeFileSync(swPath, sw);
}

// 5. GitHub Pages fallback for unknown routes — keep visitors on the landing.
fs.copyFileSync(path.join(out, 'index.html'), path.join(out, '404.html'));

// 6. Disable Jekyll so files starting with _ are served verbatim.
fs.writeFileSync(path.join(out, '.nojekyll'), '');

console.log(`Built dist-web/  (landing + /app/, build ${buildId})`);
