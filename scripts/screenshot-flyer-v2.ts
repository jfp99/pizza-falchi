import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await context.newPage();
  
  // Screenshot flyer page
  await page.goto('http://localhost:3000/flyer', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'e2e-results/flyer-v2-full.png', fullPage: true });
  console.log('Full page screenshot saved');
  
  // Get just the flyer element
  const flyerElement = await page.locator('[role="document"]').first();
  if (flyerElement) {
    await flyerElement.screenshot({ path: 'e2e-results/flyer-v2-only.png' });
    console.log('Flyer only screenshot saved');
  }
  
  await browser.close();
})();
