// Normalize colors so a hex palette can be compared against browser-computed rgb() values.

export function hexToKey(hex: string): string {
  const h = hex.replace('#', '').trim();
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

// getComputedStyle returns "rgb(r, g, b)" / "rgba(r, g, b, a)".
// Returns "r,g,b" or null for fully transparent / non-color values.
export function computedToKey(value: string): string | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === 'transparent' || v === 'none') return null;
  const m = v.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(',').map((s) => s.trim());
  const [r, g, b] = parts;
  const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
  if (a === 0) return null; // fully transparent — ignore
  return `${parseInt(r, 10)},${parseInt(g, 10)},${parseInt(b, 10)}`;
}

export function loadAllowed(colors: string[]): Set<string> {
  return new Set(colors.map(hexToKey));
}
