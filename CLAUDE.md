# pulsar-ide-laevi

Custom Pulsar IDE package. Read `README.md` first for what it does and its architecture.

## Why this exists

The third-party `pulsar-ide-css`, `pulsar-ide-json`, `pulsar-ide-typescript`, `pulsar-ide-bash`, `pulsar-ide-yaml` packages all showed `atom.packages.isPackageActive() === true` but never spawned a server, with zero console errors and zero notification toasts — root cause never found despite extensive investigation. This package bypasses them entirely, talking to the same underlying LSP binaries/tools directly via `@savetheclocktower/atom-languageclient` (the same base library `pulsar-ide-python` uses, which does work correctly and was left untouched).

## Environment this was built/tested on

- Pulsar 1.132.1, AUR `pulsar-bin` package, installed at `/opt/Pulsar`
- `ppm` binary (Pulsar's package manager, NOT `pnpm`) at `/opt/Pulsar/resources/app/ppm/bin/ppm`, not on `PATH`
- `bash-language-server`, `yaml-language-server`, `typescript-language-server` installed via pacman
- `python-lsp-server` handled separately by the pre-existing `pulsar-ide-python` package — not this one

## Debugging incidents worth knowing about (chronological)

1. **CSS/JSON servers via `spawnChildNode` (Pulsar's own Electron-as-Node) were silently dead** — process alive, LSP handshake apparently fine when tested manually outside Pulsar, but zero diagnostics ever reached the editor in real use. Root cause never fully confirmed; switching CSS/JSON to plain synchronous linters (no persistent server at all) sidestepped it rather than chasing it further — that's a deliberate architectural choice, not a stopgap. Don't reintroduce an LSP-based CSS/JSON client without expecting to hit this again.
2. **`require("stylelint")` at module top-level crashed the ENTIRE package on activation** (`ENOTDIR: not a directory, open '/opt/Pulsar/resources/app.asar/static/package.json'`) — stylelint's cosmiconfig-based search walked upward from Pulsar's actual `process.cwd()` (which sits inside the packed `app.asar`) and choked on it. Because `main.js` eagerly `require()`s every client file, this took down bash/yaml/typescript too as collateral damage. Lesson: any dependency with filesystem-search side effects (config resolvers, ignore-file lookups) must be lazily required inside the function that uses it, not at module top-level, in a package this eagerly loaded.
3. **Switched CSS entirely off `stylelint` to bare `postcss`** to kill the above class of bug for good, not just work around it for one input.
4. **`postcss().process(code).sync()` with zero plugins silently skipped parsing** — returned no errors even for genuinely unclosed blocks. Fixed by calling `postcss.parse(code, opts)` directly (unconditional parse, no lazy pipeline).
5. **`postcss.parse(code, { syntax })` silently ignores the `syntax` option** — that's a stylelint/postcss-cli convention, not something the low-level `postcss.parse()` honors. Must dispatch manually: `(syntax ? syntax.parse : postcss.parse)(code, opts)`. This one produced a very confusing false positive (flagging valid Less `//` comments as broken) that looked identical to "wrong grammar scope string" until reproduced directly with `node -e`.
6. **`status-bar` service version mismatch** — declared `"1.0.0"` in `consumedServices`, but Pulsar's `status-bar` package actually provides `"0.58.0"` (legacy) and `"1.1.0"`. Wrong version number = `consumeStatusBar` silently never called, no error anywhere. Confirmed via `atom.packages.getActivePackage('status-bar').metadata.providedServices` in the dev console — that's the reliable way to check any service's real version before wiring `consumedServices` to it.

## Debugging technique that actually worked

The user cannot easily run/reload Pulsar for you to observe directly. The reliable loop was:
1. Reproduce the exact failing input with a plain `node -e "..."` script calling the linter/module directly with a fake `textEditor` object (`{ getText, getPath, getGrammar }`) — this caught bugs #4 and #5 immediately, without needing a Pulsar reload at all.
2. For anything needing the real `atom` global (the LSP client classes), ask the user to run specific one-line console commands (`atom.packages.isPackageActive(...)`, `atom.packages.getActivePackage(...).metadata...`) rather than guessing from screenshots.
3. `ps aux | grep <server-name>` on this machine directly confirms whether a server process actually spawned — much more reliable than asking the user to interpret UI state.
