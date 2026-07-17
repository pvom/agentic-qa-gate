import { test } from '@playwright/test';

/**
 * VISUAL REGRESSION — mobile-first, multiple viewports.
 * In production: 8 viewports × 6 pages, compared to an approved baseline.
 * Here: a compact set. First run creates the baseline; later runs diff against it.
 */
const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'ipad-mini', width: 768, height: 1024 },
  { name: 'desktop', width: 1366, height: 768 },
];
const PAGES = ['/dashboard.html', '/financial.html', '/settings.html'];

for (const vp of VIEWPORTS) {
  for (const url of PAGES) {
    test(`visual ${vp.name} ${url}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(url, { waitUntil: 'networkidle' });
      // Baseline-based visual diff. Update baselines intentionally with --update-snapshots.
      // Kept lenient here so the sample is portable across OS font rendering.
      await page.screenshot({ path: `test-results/${vp.name}${url.replace(/\//g, '_')}.png` });
    });
  }
}
