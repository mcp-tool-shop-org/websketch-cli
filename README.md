<p align="center"><img src="logo.png" alt="websketch logo" width="200"></p>

# websketch

> Part of [MCP Tool Shop](https://mcptoolshop.com)

**CLI for WebSketch IR -- render, diff, and fingerprint web UI captures so LLMs and CI pipelines can reason about what users see.**

[![npm version](https://img.shields.io/npm/v/@mcptoolshop/websketch.svg)](https://www.npmjs.com/package/@mcptoolshop/websketch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![node 18+](https://img.shields.io/badge/node-18%2B-brightgreen.svg)](https://nodejs.org)

---

## At a Glance

- **ASCII rendering** -- turn any WebSketch capture into a box-drawing layout that fits in a terminal or LLM context window
- **Structural fingerprinting** -- hash a page's layout so you can detect changes without pixel diffing
- **Semantic diff** -- compare two captures and get a ranked change report (added, moved, resized, text changed)
- **Bundle packaging** -- combine captures (and optional diff) into a single shareable `.ws.json` file
- **Pipeline-first** -- every command supports `--json` output and deterministic exit codes for CI scripting
- **LLM-optimized mode** -- `--llm` flag produces metadata-rich output designed for agent consumption

## Install

```bash
pnpm add -g @mcptoolshop/websketch
```

Or run without installing:

```bash
npx @mcptoolshop/websketch render capture.json
```

## Commands

### validate

Check that a capture file conforms to the WebSketch IR schema.

```bash
websketch validate capture.json
```

### render-ascii

Render a capture to ASCII art (LLM-readable).

```bash
# Default 80x24 grid
websketch render-ascii capture.json

# LLM-optimized format with metadata and legend
websketch render-ascii --llm capture.json

# Custom dimensions
websketch render-ascii --width 120 --height 40 capture.json

# Minimal structure-only view
websketch render-ascii --structure capture.json
```

**Example output:**

```
+---------------------------------------------------------------------------+
|[NAV:primary_nav]                                                          |
+---------------------------------------------------------------------------+
|                    +----------------------------------------+             |
|                    |[FRM:login]                             |             |
|                    |  [INP:email]                           |             |
|                    |  [INP:password]                        |             |
|                    |  [BTN:primary_cta]                     |             |
|                    +----------------------------------------+             |
+---------------------------------------------------------------------------+
```

### fingerprint

Compute a structural fingerprint for comparison.

```bash
# Full fingerprint (includes text)
websketch fingerprint capture.json
# Output: e33442b6

# Layout-only fingerprint (ignores text changes)
websketch fingerprint --layout-only capture.json
```

### diff

Compare two captures and report changes.

```bash
# Human-readable diff report
websketch diff before.json after.json

# JSON output
websketch diff --json before.json after.json

# Layout-only (ignore text changes)
websketch diff --layout-only before.json after.json

# Custom match threshold
websketch diff --threshold 0.7 before.json after.json
```

### bundle

Package one or more captures into a shareable `.ws.json` file. When exactly two captures are provided, the bundle automatically includes a diff summary.

```bash
websketch bundle capture.json -o bundle.ws.json
websketch bundle before.json after.json -o bundle.ws.json
```

## Pipeline Mode

Add `--json` before any command for machine-readable output:

```bash
websketch --json validate capture.json
websketch --json render capture.json
websketch --json fingerprint capture.json
websketch --json diff before.json after.json
```

**Success:** `{ "ok": true, ... }`

**Error:** `{ "ok": false, "error": { "code": "WS_...", "message": "..." } }`

Exit codes still apply in JSON mode -- use `$?` or `set -e` in scripts.

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Validation / data error (bad JSON, invalid capture, unknown command) |
| 2 | Filesystem error (file not found, permission denied, I/O error) |

## Capture Format

This CLI works with WebSketch IR capture files (JSON). Create captures using:

- [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) -- Chrome extension for one-click page capture
- [@mcptoolshop/websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) -- build captures programmatically

## Docs

| Document | Description |
|----------|-------------|
| [HANDBOOK.md](HANDBOOK.md) | Deep-dive guide: architecture, commands, pipeline patterns, integration |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute, dev setup, PR guidelines |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community standards |
| [CHANGELOG.md](CHANGELOG.md) | Release history |

## License

MIT
