<p align="center">
  <img src=".github/websketch-logo.png" alt="WebSketch" width="400">
</p>

# websketch

CLI for [WebSketch IR](https://github.com/mcp-tool-shop-org/websketch-ir) - render, diff, and fingerprint web UI captures.

## Installation

```bash
npm install -g websketch
```

Or use via npx:

```bash
npx websketch render-ascii capture.json
```

## Commands

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
┌──────────────────────────────────────────────────────────────────────────────┐
│[NAV:primary_nav]                                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                    ┌────────────────────────────────────────┐                │
│                    │[FRM:login]                             │                │
│                    │  [INP:email]                           │                │
│                    │  [INP:password]                        │                │
│                    │  [BTN:primary_cta]                     │                │
│                    └────────────────────────────────────────┘                │
└──────────────────────────────────────────────────────────────────────────────┘
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

**Example output:**

```
WebSketch IR Diff Report
════════════════════════════════════════════════════════════

SUMMARY
────────────────────────────────────────
Nodes: 14 → 16
Identical: No

CHANGE COUNTS
────────────────────────────────────────
  Added:      2
  Moved:      6
  Resized:    2
  Text:       2

TOP CHANGES (by area)
────────────────────────────────────────
  [CHILDREN_CHANGED] PAGE children: 3 → 4
  [MOVED] FORM:login moved by (0.0%, 2.0%)
  [ADDED] Added TOAST:notification at (70%, 10%)
```

## Pipeline Mode (`--json`)

Add `--json` before any command for machine-readable output:

```bash
websketch --json validate capture.json
websketch --json render capture.json
websketch --json fingerprint capture.json
websketch --json diff before.json after.json
```

**Success:** `{ "ok": true, ... }` (shape depends on command)

**Error:** `{ "ok": false, "error": { "code": "WS_...", "message": "..." } }`

Exit codes still apply in JSON mode — use `$?` or `set -e` in scripts.

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Validation / data error (bad JSON, invalid capture, unknown command) |
| 2 | Filesystem error (file not found, permission denied, I/O error) |

## Capture Format

This CLI works with WebSketch IR capture files (JSON). You can create captures using:

- [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) - Chrome extension
- Programmatically via [@mcptoolshop/websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir)

## Development

```bash
# Install dependencies
npm install

# Type check
npm run typecheck

# Lint
npm run lint

# Run tests
npm test

# Build
npm run build

# Test locally
node dist/index.js --help
```

## License

MIT

## Author

[MCP Tool Shop](https://github.com/mcp-tool-shop)
