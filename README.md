# pulsar-ide-laevi

Language server support for Bash, YAML, TypeScript/JavaScript, CSS, and JSON in [Pulsar](https://pulsar-edit.dev/) — diagnostics, autocomplete, hover, and outline, all working even on standalone files that aren't part of an open project.

## Features

- **Bash, YAML, TypeScript/JavaScript** — full language server support (`bash-language-server`, `yaml-language-server`, `typescript-language-server`): diagnostics, autocomplete, hover, and outline.
- **CSS, JSON** — full language server support via [Biome](https://biomejs.dev/): diagnostics and autocomplete. (Outline isn't available for these two yet — Biome's language server doesn't implement that capability.)
- **Less, Scss** — syntax-error checking, dialect detected automatically.
- **Works without a project folder open.** Most Pulsar language-server packages only activate for files inside an added project folder. This package activates for any file, standalone or not.
- A status bar indicator shows which languages currently have an active connection.

## Install

From Pulsar's package manager: search for `pulsar-ide-laevi` in Settings → Install, or run:

```
ppm install pulsar-ide-laevi
```

## Requirements

These system tools need to be installed and available on your `PATH`:

- `bash-language-server`
- `yaml-language-server`
- `typescript-language-server`
- `node` (used to launch the three servers above)

Nothing extra is needed for CSS, JSON, Less, or Scss — those are fully self-contained in this package.

## Why this exists

Pulsar's ecosystem already has language-server packages for these languages, but on some setups they fail to activate their servers with no visible error at all — nothing in the console, no notification. This package is a from-scratch alternative that talks to the same underlying language servers directly, built and tested to confirm each one actually works end-to-end rather than just installing without errors.

## Known limitations

- Outline (symbol/structure view) works for Bash, YAML, and TypeScript/JavaScript, but not CSS or JSON — this is a limitation of Biome's language server, not something this package can currently work around.
- Less/Scss get syntax checking only (no autocomplete/hover) since Biome's CSS support doesn't cover those dialects.

## Contributing

Issues and PRs are welcome. If you want to add support for another language, look at `lib/clients/*.js` for the pattern — each one is a small subclass covering one language server.

## License

MIT
