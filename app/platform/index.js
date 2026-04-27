// Detects the runtime and returns the right platform implementation.
// Each platform module exports the same shape so renderer.js can
// stay environment-agnostic.

import electron from './electron.js';
import web from './web.js';

let platform;

if (typeof window !== 'undefined' && window.dt) {
  platform = electron;
} else if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
  // Lazy-load Capacitor module only on Capacitor builds so the web bundle
  // doesn't have to ship its dependencies.
  const mod = await import('./capacitor.js');
  platform = mod.default;
} else {
  platform = web;
}

export default platform;
