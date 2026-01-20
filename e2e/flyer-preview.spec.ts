import { test, expect } from '@playwright/test';

test('capture flyer preview', async ({ page }) => {
  // Navigate to flyer page
  await page.goto('/flyer');

  // Wait for the flyer to render
  await page.waitForTimeout(2000);

  // Click on A4 Landscape tab if it exists
  const a4Tab = page.getByRole('button', { name: /A4 Landscape/i });
  if (await a4Tab.isVisible()) {
    await a4Tab.click();
    await page.waitForTimeout(1000);
  }

  // Take full page screenshot
  await page.screenshot({
    path: 'e2e-results/flyer-a4-preview.png',
    fullPage: true,
  });

  // Also capture just the flyer element if possible
  const flyerElement = page.locator('article[role="document"]');
  if (await flyerElement.isVisible()) {
    await flyerElement.screenshot({
      path: 'e2e-results/flyer-a4-only.png',
    });
  }

  console.log('Screenshots saved to e2e-results/');
});
