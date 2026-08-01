# pulsar-ide-laevi

Custom Pulsar package wiring up diagnostics for Bash, YAML, TypeScript/JavaScript, JSON, and CSS/Less/Scss — built after the third-party `pulsar-ide-*` packages for these languages silently never activated their servers on this system, for reasons never fully root-caused.

## What it does

- **Bash, YAML, TypeScript/JavaScript**: full LSP clients (`bash-language-server`, `yaml-language-server`, `typescript-language-server`), giving diagnostics, hover, completion, etc.
- **JSON**: plain `JSON.parse`-based syntax checking, no dependency, no server.
- **CSS / Less / Scss**: syntax-error checking via `postcss` + `postcss-less` + `postcss-scss`, dialect chosen automatically from the file's grammar scope.
- **Works on standalone files** — a file doesn't need to be inside an added Pulsar project folder for any of the above to activate. Normally Pulsar's LSP client library refuses to start a server for such files; this package overrides that.
- Status bar tile (bottom right) showing which of the 5 languages are currently active, e.g. `LSP: Bash, CSS, JSON`.

## Install

```fish
cd ~/Projects/pulsar-ide-laevi
/opt/Pulsar/resources/app/ppm/bin/ppm install
```

Then `ppm link ~/Projects/pulsar-ide-laevi` (symlinks it into `~/.pulsar/packages/pulsar-ide-laevi`) if not already linked, and reload Pulsar.

## Requirements

System binaries expected on `PATH` (this package does not install them):

- `bash-language-server`
- `yaml-language-server`
- `typescript-language-server`
- `node` (used to spawn the above three)

Nothing external needed for JSON/CSS — those run entirely on bundled npm dependencies.

## Architecture

- `lib/base-client.js` — shared `AutoLanguageClient` subclass. Overrides `determineProjectPath` to fall back to the file's own directory when no project folder contains it (the standalone-file fix), and wraps `spawn()` to report to the status bar.
- `lib/clients/{bash,yaml,typescript}.js` — thin per-language LSP clients, bare-name `spawn()` relying on `PATH`.
- `lib/simple-linters/{json,css}.js` — synchronous, non-LSP linter providers (classic `linter` v2 API, not `linter-indie`).
- `lib/status.js` — the status bar tile.
- `lib/main.js` — activates everything, exposes `consumeLinterV2`/`provideLinter`/`consumeStatusBar`.

## Known gotchas (see CLAUDE.md for the full incident log)

- `postcss.parse(code, { syntax })` does **not** work — `syntax` is a stylelint/postcss-cli convention, not honored by the low-level `postcss.parse()` function. Call `syntax.parse(code, opts)` directly instead.
- Any top-level `require()` in a file eagerly loaded by `main.js` that throws during package activation takes down the **entire** package, not just that one feature — prefer lazy `require()` inside the function that needs it for anything with filesystem-search side effects (config resolvers, `cosmiconfig`, etc).
- Pulsar's `status-bar` service is versioned `1.1.0` (and legacy `0.58.0`), not `1.0.0` — a wrong version number in `consumedServices` fails silently with no error anywhere.
