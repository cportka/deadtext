#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const src = path.join(root, 'src');
const out = path.join(root, 'dist-web');

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
copyTree(src, out);

// Stamp the service worker with a unique build ID so updates are picked up.
const swPath = path.join(out, 'sw.js');
if (fs.existsSync(swPath)) {
  const sw = fs.readFileSync(swPath, 'utf8').replace(/__BUILD_ID__/g, buildId);
  fs.writeFileSync(swPath, sw);
}

// GitHub Pages serves 404.html for unmatched routes; reuse index.html so
// deep-link refreshes stay in the app shell.
fs.copyFileSync(path.join(out, 'index.html'), path.join(out, '404.html'));

// Disable Jekyll on GitHub Pages so files starting with _ are served verbatim.
fs.writeFileSync(path.join(out, '.nojekyll'), '');

console.log(`Built dist-web/ (build ${buildId})`);
