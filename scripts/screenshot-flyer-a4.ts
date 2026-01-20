import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 1200 } });
  const page = await context.newPage();

  console.log('Navigating to flyer page...');
  await page.goto('http://localhost:3000/flyer', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Screenshot full page (A4 format default)
  await page.screenshot({ path: 'e2e-results/flyer-a4-page.png', fullPage: true });
  console.log('Full page screenshot saved: flyer-a4-page.png');

  // Get just the flyer element
  const flyerElement = await page.locator('[role="document"]').first();
  if (flyerElement) {
    await flyerElement.screenshot({ path: 'e2e-results/flyer-a4-only.png' });
    console.log('Flyer only screenshot saved: flyer-a4-only.png');
  }

  // Switch to A5 format and screenshot
  console.log('Switching to A5 format...');
  await page.click('text=A5 Portrait');
  await page.waitForTimeout(1000);

  const flyerA5Element = await page.locator('[role="document"]').first();
  if (flyerA5Element) {
    await flyerA5Element.screenshot({ path: 'e2e-results/flyer-a5-only.png' });
    console.log('A5 Flyer screenshot saved: flyer-a5-only.png');
  }

  await browser.close();
  console.log('Done!');
})();
