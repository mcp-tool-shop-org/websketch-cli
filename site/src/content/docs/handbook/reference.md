---
title: Reference
description: Exit codes, capture format, and ecosystem.
sidebar:
  order: 4
---

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Validation / data error (bad JSON, invalid capture, unknown command) |
| 2 | Filesystem error (file not found, permission denied, I/O error) |

## Capture format

WebSketch CLI works with WebSketch IR capture files (JSON). Each capture is a tree of `UINode` objects where every node carries:

- **role** — One of 23 UI primitives (PAGE, BUTTON, NAV, CARD, INPUT, etc.)
- **bbox** — Viewport-relative bounding box `[x, y, w, h]` in `[0, 1]` range
- **text** — Text signal with hash, length, and classification
- **children** — Nested child nodes

## Security & data scope

| Aspect | Detail |
|--------|--------|
| **Data touched** | WebSketch IR JSON files (read), rendered ASCII/diff/fingerprint output (write to stdout/files) |
| **Data NOT touched** | No telemetry, no analytics, no network calls, no credential storage |
| **Permissions** | Read: input JSON files. Write: output files to user-specified paths |
| **Network** | None — fully offline CLI tool |

## Ecosystem

| Package | Role |
|---------|------|
| [websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) | Core IR grammar and serialization |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | Chrome extension for in-browser capture |
| [websketch-vscode](https://github.com/mcp-tool-shop-org/websketch-vscode) | Capture pages right from VS Code |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | MCP server for LLM agent integration |
| [websketch-demo](https://github.com/mcp-tool-shop-org/websketch-demo) | Interactive playground and visualization |
