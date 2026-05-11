#!/usr/bin/env bash
# build-and-sync.sh — rebuild the web app and copy it into ios + android shells.
#
# usage:  ./scripts/build-and-sync.sh
# run from anywhere — the script resolves paths relative to its own location.
#
# exit codes:
#   0  success
#   1  web build failed
#   2  cap sync failed
#   3  could not resolve mobile/ root

set -euo pipefail

# resolve mobile/ root (this script lives in mobile/scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MOBILE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$MOBILE_ROOT/.." && pwd)"

if [[ ! -f "$REPO_ROOT/package.json" ]]; then
  echo "error: could not find repo root package.json at $REPO_ROOT/package.json" >&2
  exit 3
fi

echo "==> building web app at $REPO_ROOT"
if ! pnpm -C "$REPO_ROOT" build; then
  echo "error: web build failed" >&2
  exit 1
fi

if [[ ! -d "$REPO_ROOT/out" ]]; then
  echo "error: expected static export at $REPO_ROOT/out but the directory does not exist" >&2
  echo "       confirm next.config.ts has output: 'export'" >&2
  exit 1
fi

echo "==> running cap sync inside $MOBILE_ROOT"
cd "$MOBILE_ROOT"
if ! npx cap sync; then
  echo "error: cap sync failed" >&2
  exit 2
fi

echo "==> done. web build copied into ios/ and android/ shells."
