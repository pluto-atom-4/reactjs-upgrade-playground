// Load environment variables so the webServer spawned by Playwright has DATABASE_URL, etc.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
} catch (e) {
  // ignore
}

import { PlaywrightTestConfig, devices } from '@playwright/test';

const opts = {
  // launch headless on CI, in browser locally
  headless: !!process.env.CI || !!process.env.PLAYWRIGHT_HEADLESS,
  // collectCoverage: !!process.env.PLAYWRIGHT_HEADLESS
};
const config: PlaywrightTestConfig = {
  testDir: './playwright',
  timeout: 35e3,
  outputDir: './playwright/test-results',
  // 'github' for GitHub Actions CI to generate annotations, plus a concise 'dot'
  // default 'list' when running locally
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    ...devices['Desktop Chrome'],
    headless: opts.headless,
    video: 'on',
  },
  retries: process.env.CI ? 3 : 0,
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev:nomigrate',
    reuseExistingServer: Boolean(process.env.TEST_LOCAL === '1'),
    port: 3000,
  },
};

export default config;
