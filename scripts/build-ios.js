#!/usr/bin/env node
// Builds the iOS app for the simulator (no signing required) so CI can
// produce a verifiable artifact without an Apple Developer account.
// Requires macOS with Xcode + CocoaPods, and the `ios/` Capacitor project
// (`npm run cap:add:ios` once) — both available on the macos-latest runner.
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');
const iosDir = path.join(root, 'ios');

if (process.platform !== 'darwin') {
  console.error('iOS builds require macOS. Skipping.');
  process.exit(0);
}

if (!fs.existsSync(iosDir)) {
  console.error('No ios/ project. Run: npm run cap:add:ios');
  process.exit(1);
}

function run(bin, argv, cwd) {
  const res = spawnSync(bin, argv, { stdio: 'inherit', cwd: cwd || root });
  if (res.status !== 0) process.exit(res.status || 1);
}

run(process.execPath, [path.join(__dirname, 'build-web.js')]);
run('npx', ['--yes', 'cap', 'sync', 'ios']);

const appDir = path.join(iosDir, 'App');
const archivePath = path.join(root, 'dist-mobile', 'DeadText-Simulator.xcarchive');
const exportDir = path.join(root, 'dist-mobile', 'ios');
fs.mkdirSync(path.dirname(archivePath), { recursive: true });

run('xcodebuild', [
  '-workspace', path.join(appDir, 'App.xcworkspace'),
  '-scheme', 'App',
  '-configuration', 'Debug',
  '-sdk', 'iphonesimulator',
  '-derivedDataPath', path.join(root, 'dist-mobile', 'derived'),
  'CODE_SIGNING_ALLOWED=NO',
  'CODE_SIGNING_REQUIRED=NO',
  'build'
]);

const built = path.join(root, 'dist-mobile', 'derived', 'Build', 'Products', 'Debug-iphonesimulator', 'App.app');
if (fs.existsSync(built)) {
  fs.mkdirSync(exportDir, { recursive: true });
  // Copy the .app bundle so it can be uploaded as an artifact and side-loaded
  // into the simulator with `xcrun simctl install`.
  run('cp', ['-R', built, exportDir]);
  console.log(`Wrote ${path.join(exportDir, 'App.app')}`);
} else {
  console.error('Build finished but App.app not found at', built);
  process.exit(1);
}
