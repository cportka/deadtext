# DeadText

A dead simple plain-text editor.

A bit like TextEdit or Notepad, but even simpler and with fewer features.
No hidden text. No formatting. No settings to fiddle with. Just a textarea
and your file. UTF-8 in, UTF-8 out.

> "because everything sucked for this sort of thing" — cportka

## Run from source

Requires Node 20+.

```sh
npm install
npm start
```

## Build installers

```sh
npm run build:mac     # .dmg + .zip (x64 + arm64)
npm run build:win     # NSIS installer + portable .exe
npm run build:linux   # AppImage + .deb + .rpm
```

Outputs go to `dist/`. Builds for a given OS must be produced on that OS
(or via the GitHub Actions workflow), with one exception: Linux builds work
fine from macOS or Linux runners.

## Keys

| Action     | macOS              | Win/Linux         |
| ---------- | ------------------ | ----------------- |
| New        | `Cmd + N`          | `Ctrl + N`        |
| Open       | `Cmd + O`          | `Ctrl + O`        |
| Save       | `Cmd + S`          | `Ctrl + S`        |
| Save As    | `Cmd + Shift + S`  | `Ctrl + Shift + S`|
| Close      | `Cmd + W`          | `Ctrl + W`        |
| Quit       | `Cmd + Q`          | `Ctrl + Q`        |

You can also drop a file onto the window to open it, or use "Open With…"
from your OS file manager.

## License

ISC. See [LICENSE](./LICENSE).
