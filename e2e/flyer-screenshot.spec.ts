import { test } from '@playwright/test';

test('capture flyer screenshot', async ({ page }) => {
  await page.goto('/flyer');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'e2e-results/flyer-text-spacing-test.png', fullPage: false });
});
