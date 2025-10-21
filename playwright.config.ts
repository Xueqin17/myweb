import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',             
  testMatch: /.*\.spec\.ts/,      
  fullyParallel: true,
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    headless: true, 
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});