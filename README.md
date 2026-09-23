# pulsar-ide-laevi

Language server support for Bash, YAML, TypeScript/JavaScript, Python, CSS, and JSON in [Pulsar](https://pulsar-edit.dev/) — diagnostics, autocomplete, hover, outline, go-to-definition, and find-references, all working even on standalone files that aren't part of an open project.

## Features

- **Bash, YAML, TypeScript/JavaScript, Python** — full language server support (`bash-language-server`, `yaml-language-server`, `typescript-language-server`, `pylsp`): diagnostics, autocomplete, hover, outline, go-to-definition, and find-references.
- **CSS, JSON** — full language server support via [Biome](https://biomejs.dev/): diagnostics, autocomplete, go-to-definition, and find-references. (Outline isn't available for these two yet — Biome's language server doesn't implement that capability.)
- Go-to-definition and find-references need a UI consumer package installed - e.g. [`atom-ide-definitions`](https://web.pulsar-edit.dev/packages/atom-ide-definitions) + [`atom-ide-hyperclick`](https://web.pulsar-edit.dev/packages/atom-ide-hyperclick) for jump-to-definition, and [`pulsar-find-references`](https://web.pulsar-edit.dev/packages/pulsar-find-references) for the references panel. This package provides the data; those provide the UI.
- **Less, Scss** — syntax-error checking, dialect detected automatically.
- **Works without a project folder open.** Most Pulsar language-server packages only activate for files inside an added project folder. This package activates for any file, standalone or not.
- A status bar indicator shows which languages currently have an active connection.

## Install

From Pulsar's package manager: search for `pulsar-ide-laevi` in Settings → Install, or run:

```
ppm install pulsar-ide-laevi
```

If you already use another Python/Bash/YAML/TypeScript IDE package, disable or uninstall it first to avoid duplicate diagnostics.

## Requirements

These system tools need to be installed and available on your `PATH`:

- `bash-language-server`
- `yaml-language-server`
- `typescript-language-server`
- `python3` with `python-lsp-server` (`pylsp`) installed, **including its lint plugins** (`pyflakes`, `pycodestyle` — some distros package these separately from the base server)
- `node` (used to launch the servers above)

Nothing extra is needed for CSS, JSON, Less, or Scss — those are fully self-contained in this package.

## Why this exists

Pulsar's ecosystem already has language-server packages for these languages, but on some setups they fail to activate their servers with no visible error at all — nothing in the console, no notification. This package is a from-scratch alternative that talks to the same underlying language servers directly, built and tested to confirm each one actually works end-to-end rather than just installing without errors.

## Known limitations

- Outline (symbol/structure view) works for Bash, YAML, and TypeScript/JavaScript, but not CSS or JSON — this is a limitation of Biome's language server, not something this package can currently work around.
- Go-to-definition and find-references show up empty for a language if its underlying server doesn't implement that LSP capability for the symbol in question - this package just forwards whatever the server returns.
- Less/Scss get syntax checking only (no autocomplete/hover) since Biome's CSS support doesn't cover those dialects.

## Contributing

Issues and PRs are welcome. If you want to add support for another language, look at `lib/clients/*.js` for the pattern — each one is a small subclass covering one language server.

## License

MIT
