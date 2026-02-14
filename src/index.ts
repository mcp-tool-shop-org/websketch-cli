#!/usr/bin/env node
/**
 * WebSketch CLI
 *
 * Commands:
 *   render-ascii <capture.json>  - Render capture to ASCII
 *   fingerprint <capture.json>   - Compute structural fingerprint
 *   diff <a.json> <b.json>       - Compare two captures
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { createRequire } from "module";

const _require = createRequire(import.meta.url);
const pkg = _require("../package.json") as { version: string };

import {
  renderAscii,
  renderForLLM,
  renderStructure,
  fingerprintCapture,
  fingerprintLayout,
  diff,
  formatDiff,
  formatDiffJson,
  type WebSketchCapture,
} from "@mcptoolshop/websketch-ir";

// =============================================================================
// Helpers
// =============================================================================

function loadCapture(path: string): WebSketchCapture {
  const fullPath = resolve(process.cwd(), path);
  const content = readFileSync(fullPath, "utf-8");
  return JSON.parse(content) as WebSketchCapture;
}

function printUsage(): void {
  console.log(`
WebSketch CLI v${pkg.version}

Usage:
  websketch <command> [options] <args>

Commands:
  render-ascii <capture.json>    Render capture to ASCII art
    --width <n>                  Grid width (default: 80)
    --height <n>                 Grid height (default: 24)
    --llm                        Use LLM-optimized format with metadata
    --structure                  Minimal structure-only view

  fingerprint <capture.json>     Compute structural fingerprint
    --layout-only                Ignore text content (layout-only fingerprint)

  diff <a.json> <b.json>         Compare two captures
    --layout-only                Ignore text content changes
    --json                       Output as JSON
    --threshold <n>              Match threshold 0-1 (default: 0.5)

Examples:
  websketch render-ascii capture.json
  websketch render-ascii --llm capture.json
  websketch render-ascii --width 120 --height 40 capture.json
  websketch fingerprint capture.json
  websketch fingerprint --layout-only capture.json
  websketch diff before.json after.json
  websketch diff --json before.json after.json
`);
}

// =============================================================================
// Commands
// =============================================================================

function cmdRenderAscii(args: string[]): void {
  let width = 80;
  let height = 24;
  let llmMode = false;
  let structureMode = false;
  let capturePath: string | null = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--width" && args[i + 1]) {
      width = parseInt(args[++i], 10);
    } else if (arg === "--height" && args[i + 1]) {
      height = parseInt(args[++i], 10);
    } else if (arg === "--llm") {
      llmMode = true;
    } else if (arg === "--structure") {
      structureMode = true;
    } else if (!arg.startsWith("-")) {
      capturePath = arg;
    }
  }

  if (!capturePath) {
    console.error("Error: Missing capture file path");
    printUsage();
    process.exit(1);
  }

  try {
    const capture = loadCapture(capturePath);

    let output: string;
    if (llmMode) {
      output = renderForLLM(capture);
    } else if (structureMode) {
      output = renderStructure(capture, width, height);
    } else {
      output = renderAscii(capture, { width, height });
    }

    console.log(output);
  } catch (err) {
    console.error(`Error loading capture: ${err}`);
    process.exit(1);
  }
}

function cmdFingerprint(args: string[]): void {
  let layoutOnly = false;
  let capturePath: string | null = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--layout-only") {
      layoutOnly = true;
    } else if (!arg.startsWith("-")) {
      capturePath = arg;
    }
  }

  if (!capturePath) {
    console.error("Error: Missing capture file path");
    printUsage();
    process.exit(1);
  }

  try {
    const capture = loadCapture(capturePath);

    const fingerprint = layoutOnly
      ? fingerprintLayout(capture)
      : fingerprintCapture(capture);

    console.log(fingerprint);
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
}

function cmdDiff(args: string[]): void {
  let layoutOnly = false;
  let jsonOutput = false;
  let threshold = 0.5;
  const paths: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--layout-only") {
      layoutOnly = true;
    } else if (arg === "--json") {
      jsonOutput = true;
    } else if (arg === "--threshold" && args[i + 1]) {
      threshold = parseFloat(args[++i]);
    } else if (!arg.startsWith("-")) {
      paths.push(arg);
    }
  }

  if (paths.length !== 2) {
    console.error("Error: diff requires exactly 2 capture files");
    printUsage();
    process.exit(1);
  }

  try {
    const captureA = loadCapture(paths[0]);
    const captureB = loadCapture(paths[1]);

    const result = diff(captureA, captureB, {
      includeText: !layoutOnly,
      includeName: !layoutOnly,
      matchThreshold: threshold,
    });

    if (jsonOutput) {
      console.log(formatDiffJson(result));
    } else {
      console.log(formatDiff(result));
    }
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
}

// =============================================================================
// Main
// =============================================================================

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printUsage();
    process.exit(0);
  }

  if (args[0] === "--version" || args[0] === "-v") {
    console.log(`websketch v${pkg.version}`);
    process.exit(0);
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  switch (command) {
    case "render-ascii":
    case "render":
    case "ascii":
      cmdRenderAscii(commandArgs);
      break;
    case "fingerprint":
    case "fp":
      cmdFingerprint(commandArgs);
      break;
    case "diff":
      cmdDiff(commandArgs);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
  }
}

main();
