#!/usr/bin/env bash
# STATIC design-system / accessibility audit — scans source for violations without booting anything.
# Exit 0 = clean · Exit 1 = violations found (each reported with file:line).
set -uo pipefail
DIR="${1:-demo-app}"
violations=0

report() { echo "  $1"; violations=$((violations + 1)); }

echo "== DS static audit on '$DIR' =="

# 1) Hardcoded colors in inline styles / CSS (hex literals outside styles.css tokens)
while IFS= read -r line; do report "hardcoded color -> $line"; done < <(
  grep -RInE 'style=("|'\'')[^"'\'']*#[0-9a-fA-F]{3,6}' --exclude='broken.html' "$DIR" 2>/dev/null
)

# 2) Arbitrary spacing / radius (Tailwind-style bracket values)
while IFS= read -r line; do report "arbitrary spacing/radius -> $line"; done < <(
  grep -RInE '(p|m|gap|rounded)-\[[0-9]+px\]' --exclude='broken.html' "$DIR" 2>/dev/null
)

# 3) Non-canonical component import (should be @ds/*, not a local ui copy)
while IFS= read -r line; do report "non-canonical import -> $line"; done < <(
  grep -RInE 'from ["'\'']@/components/ui/' --exclude='broken.html' "$DIR" 2>/dev/null
)

# 4) Accessibility: brand pink used as TEXT color (must use the accessible token)
while IFS= read -r line; do report "pink used as text (a11y) -> $line"; done < <(
  grep -RInE 'color:\s*#ff6fc9|text-pink([^-]|$)' --exclude='broken.html' "$DIR" 2>/dev/null
)

echo "--"
if [ "$violations" -gt 0 ]; then
  echo "FAIL · $violations violation(s)"
  exit 1
fi
echo "PASS · 0 violations"
exit 0
