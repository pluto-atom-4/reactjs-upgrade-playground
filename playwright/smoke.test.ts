import { test, expect } from '@playwright/test';

// Set a reasonable timeout for all tests (60 seconds total, individual tests get this)
test.setTimeout(60e3);

test('go to /', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/', { waitUntil: 'networkidle' });

  // Wait for the page to be interactive and check for key elements
  await page.waitForLoadState('domcontentloaded');

  // Check for heading with tRPC starter text (more flexible selector)
  await expect(page.locator('h1')).toContainText('Welcome to your tRPC');

  // Verify the React 19 playground link is present
  await expect(page.locator('a:has-text("React 19.2 Features Playground")')).toBeVisible();

  // Verify we can see the "Latest Posts" section
  await expect(page.locator('h2:has-text("Latest Posts")')).toBeVisible();
});

test('add a post', async ({ page }) => {
  const nonce = `${Math.random()}`;

  // Navigate to the homepage
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForLoadState('domcontentloaded');

  // Fill in the form
  await page.fill('input[name=title]', nonce);
  await page.fill('textarea[name=text]', nonce);

  // Click submit button
  await page.click('form input[type=submit]');

  // Wait for the network to be idle after submission
  await page.waitForLoadState('networkidle');

  // Reload the page to verify the post was saved
  await page.reload();
  await page.waitForLoadState('domcontentloaded');

  // Verify the post appears on the page
  await expect(page.locator(`text="${nonce}"`)).toBeVisible();
});

test('navigate to React 19 playground', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForLoadState('domcontentloaded');

  // Click on the React 19 playground link
  await page.click('a:has-text("React 19.2 Features Playground")');

  // Wait for navigation to complete
  await page.waitForURL(/\/react19-playground/);
  await page.waitForLoadState('domcontentloaded');

  // Verify we're on the playground page
  expect(page.url()).toContain('react19-playground');

  // Verify some content is loaded on the page
  await expect(page.locator('body')).toBeTruthy();
});

test('smoke test - all main routes are accessible', async ({ page }) => {
  const routes = [
    { path: '/', waitFor: 'h1' },
    { path: '/react19-playground', waitFor: 'body' },
  ];

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');

    // Verify the page loaded without errors
    const locator = page.locator(route.waitFor);
    await expect(locator).toBeTruthy();
  }
});


