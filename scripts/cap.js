#!/usr/bin/env node
// Thin wrapper around `cap` that ensures the web bundle is fresh before
// any sync/open command. Usage:
//   node scripts/cap.js add android
//   node scripts/cap.js sync
//   node scripts/cap.js open ios
const { spawnSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const cmd = args[0];

function run(bin, argv) {
  const res = spawnSync(bin, argv, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  if (res.status !== 0) process.exit(res.status || 1);
}

if (cmd === 'sync' || cmd === 'open') {
  // Rebuild the web bundle so dist-web/ reflects current src/.
  run(process.execPath, [path.join(__dirname, 'build-web.js')]);
}

run('npx', ['--yes', 'cap', ...args]);
