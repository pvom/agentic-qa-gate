import { test, expect, Page } from '@playwright/test';
import { computedToKey, loadAllowed } from './helpers/color';
import palette from './helpers/palette.json';

/**
 * RUNTIME DESIGN-SYSTEM COLOR AUDIT
 *
 * Navigates each route, reads the COMPUTED color (getComputedStyle) of every visible
 * element, and compares it against the authorized palette. A rendered color that is not
 * in the palette is a "foreign color" — the kind of drift static code analysis can't see
 * (a token resolving to the wrong value, a CSS variable overridden downstream, a
 * third-party component injecting its own palette).
 */

const ALLOWED = loadAllowed(palette.colors);
const CLEAN_ROUTES = ['/dashboard.html', '/financial.html', '/settings.html'];
const THRESHOLD = 0; // clean routes must have ZERO foreign colors

type Finding = { prop: string; value: string; sel: string };

async function collectColors(page: Page, url: string): Promise<Finding[]> {
  await page.goto(url, { waitUntil: 'networkidle' });
  return page.evaluate(() => {
    const out: { prop: string; value: string; sel: string }[] = [];
    const sel = (el: Element) =>
      el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const cs = getComputedStyle(el);
      out.push({ prop: 'color', value: cs.color, sel: sel(el) });
      out.push({ prop: 'background-color', value: cs.backgroundColor, sel: sel(el) });
      // border-color only counts when there is a visible border
      if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none') {
        out.push({ prop: 'border-color', value: cs.borderTopColor, sel: sel(el) });
      }
    }
    return out;
  });
}

function foreignColors(findings: Finding[]): Finding[] {
  const foreign: Finding[] = [];
  const seen = new Set<string>();
  for (const f of findings) {
    const key = computedToKey(f.value);
    if (key === null) continue; // transparent / non-color
    if (ALLOWED.has(key)) continue;
    const dedup = `${key}|${f.prop}|${f.sel}`;
    if (seen.has(dedup)) continue;
    seen.add(dedup);
    foreign.push(f);
  }
  return foreign;
}

for (const route of CLEAN_ROUTES) {
  test(`no foreign colors on ${route}`, async ({ page }) => {
    const foreign = foreignColors(await collectColors(page, route));
    if (foreign.length) {
      console.log(`Foreign colors on ${route}:`);
      for (const f of foreign) console.log(`  ${f.value}  ${f.prop}  ${f.sel}`);
    }
    expect(foreign.length, `foreign colors on ${route}`).toBeLessThanOrEqual(THRESHOLD);
  });
}

// Proves the detector actually works: the intentionally-broken page MUST be flagged.
test('detects foreign colors on the broken page', async ({ page }) => {
  const foreign = foreignColors(await collectColors(page, '/broken.html'));
  console.log(`Broken page foreign colors detected: ${foreign.length}`);
  for (const f of foreign) console.log(`  ${f.value}  ${f.prop}  ${f.sel}`);
  expect(foreign.length, 'detector should catch the hardcoded colors').toBeGreaterThan(0);
});
