import { test, expect } from '@playwright/test';

// Behaviour layer (illustrative). In production this is 130 e2e specs across 8 viewports.
test('navigation works across pages', async ({ page }) => {
  await page.goto('/dashboard.html');
  await expect(page.locator('h1')).toHaveText('Dashboard');
  await page.click('text=Financial');
  await expect(page.locator('h1')).toHaveText('Financial');
  await page.click('text=Settings');
  await expect(page.locator('h1')).toHaveText('Settings');
});

test('dashboard shows a metric and a primary action', async ({ page }) => {
  await page.goto('/dashboard.html');
  await expect(page.locator('.metric').first()).toBeVisible();
  await expect(page.locator('button.btn')).toBeVisible();
});
