# Changelog

## 0.3.0

- **feat**: `bundle` subcommand -- package captures into shareable `.ws.json` files
- **feat**: Warnings surfaced from captures in `validate` output
- **docs**: Getting Started quickstart block
- **docs**: CHANGELOG.md
- **chore**: Bump websketch-ir to ^0.3.0

## 0.2.1

- **feat**: `--json` global flag for machine-readable pipeline output
- **feat**: `validate` subcommand
- **feat**: `render` and `diff` promoted as first-class command names
- **feat**: Exit codes documented (0=success, 1=validation, 2=filesystem)
- **fix**: CI build order (build before test)

## 0.2.0

- **feat**: Structured error handling with `WebSketchException`
- **feat**: All error codes mapped to exit codes
- **chore**: Bump websketch-ir to ^0.3.0

## 0.1.0

- Initial release
- Commands: render-ascii, fingerprint, diff
