import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Boots the zero-dependency demo server before the suite.
  webServer: {
    command: 'node demo-app/serve.js',
    url: 'http://localhost:5174/dashboard.html',
    reuseExistingServer: !process.env.CI,
    timeout: 20_000,
  },
});
