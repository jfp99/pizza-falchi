import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  
  // Screenshot menu page  
  await page.goto('http://localhost:3000/menu', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'e2e-results/menu-review.png', fullPage: true });
  console.log('Menu screenshot saved');
  
  await browser.close();
})();
