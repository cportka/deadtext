# DeadText

A dead simple plain-text editor.

A bit like TextEdit or Notepad, but even simpler and with fewer features.
No hidden text. No formatting. No settings to fiddle with. Just a textarea
and your file. UTF-8 in, UTF-8 out.

Same code, every platform: macOS, Windows, Linux desktop apps; a PWA you
can install from any browser; iOS and Android apps via Capacitor.

> "because everything sucked for this sort of thing" — cportka

## Run from source

Requires Node 20+.

```sh
npm install
npm start                 # Electron desktop
npm run serve:web         # Web build at http://127.0.0.1:5173
```

## Build desktop installers

```sh
npm run build:mac         # .dmg + .zip (x64 + arm64)
npm run build:win         # NSIS installer + portable .exe
npm run build:linux       # AppImage + .deb + .rpm
```

Outputs go to `dist/`. Builds for a given OS must be produced on that OS
(or via the GitHub Actions workflow), with one exception: Linux builds work
fine from macOS or Linux runners.

## Build the web app

```sh
npm run build:web         # produces dist-web/
npm run serve:web         # serve dist-web/ at http://127.0.0.1:5173
```

`dist-web/` is a static site — drop it on any web host. Push to `main` and
CI publishes it to the `gh-pages` branch, which GitHub Pages serves. Layout:

- `dist-web/`       — the landing page with auto-detected download buttons
- `dist-web/app/`   — the PWA editor itself

### One-time GitHub Pages setup

After the first push to `main`, the `web` job creates a `gh-pages` branch.
In the GitHub UI go to **Settings → Pages** and set:

- **Source:** Deploy from a branch
- **Branch:** `gh-pages`  /  **Folder:** `/ (root)`

The site goes live at `https://cportka.github.io/deadtext/` within a minute.
Every subsequent push to `main` redeploys automatically — no further config.

## Build the mobile apps

iOS and Android use [Capacitor](https://capacitorjs.com) to wrap the web
build. The `android/` project is committed; the `ios/` project is generated
on-demand because it requires macOS to scaffold.

```sh
# one-time per checkout
npm run cap:add:ios       # macOS only

# then, per build
npm run build:android     # produces dist-mobile/DeadText-debug.apk
npm run build:ios         # macOS only — produces dist-mobile/ios/App.app for the simulator
```

For local development, open the native projects in their IDEs:

```sh
npm run cap:open:ios      # opens Xcode
npm run cap:open:android  # opens Android Studio
```

CI builds an unsigned `app-debug.apk` and a simulator-only iOS `.app` on
every push so you can sideload to test.

### Real-world distribution

| Channel              | What's needed                                              |
| -------------------- | ---------------------------------------------------------- |
| GitHub Releases      | Tag `v*` — installers attached automatically               |
| macOS Gatekeeper     | Apple Developer account ($99/yr) + signing/notarization    |
| Windows SmartScreen  | Code-signing cert (~$200-400/yr), or accept the warning    |
| Apple App Store      | Apple Developer account, Xcode submission                  |
| Google Play          | Play Console account ($25 one-time), signed release AAB    |
| Web (PWA)            | Already deployed to GitHub Pages on every push to `main`   |

## Keys

| Action     | macOS              | Win/Linux         |
| ---------- | ------------------ | ----------------- |
| New        | `Cmd + N`          | `Ctrl + N`        |
| Open       | `Cmd + O`          | `Ctrl + O`        |
| Save       | `Cmd + S`          | `Ctrl + S`        |
| Save As    | `Cmd + Shift + S`  | `Ctrl + Shift + S`|
| Close      | `Cmd + W`          | `Ctrl + W`        |
| Quit       | `Cmd + Q`          | `Ctrl + Q`        |

Drop a file onto the window to open it. The OS "Open with…" menu lists
DeadText for txt/md/log/json/csv/ini/yml/yaml/xml.

## License

ISC. See [LICENSE](./LICENSE).
