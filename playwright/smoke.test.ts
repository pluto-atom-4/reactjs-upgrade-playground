import { test, expect } from '@playwright/test';

const react19Demos = [
  { slug: 'use-action-state-basic', title: 'useActionState Basics' },
  { slug: 'use-action-state-advanced', title: 'useActionState Advanced' },
  { slug: 'use-optimistic', title: 'useOptimistic Todos' },
  { slug: 'use-transition', title: 'useTransition Search' },
  { slug: 'activity-component', title: 'Activity Feed Pattern' },
  { slug: 'use-effect-event', title: 'useEffectEvent Logging' },
  { slug: 'partial-pre-rendering', title: 'Partial Pre-rendering' },
  { slug: 'server-components-awareness', title: 'Server Components Awareness' },
];

// Set a reasonable timeout for all tests (60 seconds total, individual tests get this)
test.setTimeout(60e3);

// Helper: more generous selector wait
const waitVisible = async (page: any, selector: string, timeout = 10000) => {
  await page.waitForSelector(selector, { timeout });
  await expect(page.locator(selector)).toBeVisible({ timeout });
};

test('go to /', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/', { waitUntil: 'networkidle' });

  // Wait for the page to be interactive and check for key elements
  await page.waitForLoadState('domcontentloaded');

  // Check for heading with tRPC starter text (more flexible selector)
  await expect(page.locator('h1')).toContainText('Welcome to your tRPC');

  // Verify the React 19 playground link is present (use href-based selector)
  await expect(page.locator('a[href="/react19-playground"]')).toBeVisible();

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
  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/trpc') && resp.status() === 200, { timeout: 10000 }).catch(() => {}),
    page.click('form input[type=submit]'),
  ]);

  // Wait a bit for the mutation to resolve and invalidate cache
  await page.waitForTimeout(1500);

  // Reload the page to verify the post was saved (use longer timeout)
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForLoadState('domcontentloaded');

  // Verify the post appears on the page
  // Use a longer timeout because DB operations may take a moment
  await expect(page.locator(`text=${nonce}`)).toBeVisible({ timeout: 15000 });
});

test('navigate to React 19 playground', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForLoadState('domcontentloaded');

  // Click on the React 19 playground link by href (more robust than matching visible text with emoji)
  await Promise.all([
    page.waitForURL(/\/react19-playground/),
    page.click('a[href="/react19-playground"]'),
  ]);

  // Wait for the demo grid to appear (use generous timeout)
  await waitVisible(page, '[data-testid="react19-demo-grid"]', 10000);

  // Verify card count
  await expect(page.locator('[data-testid="react19-demo-card"]')).toHaveCount(react19Demos.length, { timeout: 10000 });
});

test('React 19 cards open dedicated demo pages', async ({ page }) => {
  await page.goto('/react19-playground', { waitUntil: 'networkidle' });
  await page.waitForLoadState('domcontentloaded');

  // Ensure grid is present
  await waitVisible(page, '[data-testid="react19-demo-grid"]', 10000);

  for (const demo of react19Demos) {
    const card = page.locator(`[data-demo-slug="${demo.slug}"]`).first();
    await expect(card).toBeVisible({ timeout: 5000 });

    await Promise.all([
      page.waitForURL(new RegExp(`/react19-playground/${demo.slug}`), { timeout: 10000 }),
      card.click(),
    ]);

    // Wait for the demo title to load in the detail page
    await waitVisible(page, 'h1', 10000);
    await expect(page.locator('h1')).toHaveText(demo.title, { timeout: 10000 });
    await expect(page.locator('[data-testid="react19-back-link"]')).toBeVisible({ timeout: 5000 });

    // Click back link and wait for hub
    await Promise.all([
      page.waitForURL(/\/react19-playground$/, { timeout: 10000 }),
      page.click('[data-testid="react19-back-link"]'),
    ]);

    // Ensure hub grid is visible again before next iteration
    await waitVisible(page, '[data-testid="react19-demo-grid"]', 10000);
  }
});

test('smoke test - all main routes are accessible', async ({ page }) => {
  const routes = [
    { path: '/', waitFor: 'h1' },
    { path: '/react19-playground', waitFor: '[data-testid="react19-demo-grid"]' },
    { path: `/react19-playground/${react19Demos[0]?.slug ?? ''}`, waitFor: 'h1' },
  ];

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');

    // Verify the page loaded without errors
    await expect(page.locator(route.waitFor)).toBeVisible({ timeout: 10000 });
  }
});
