/**
 * Script to take a screenshot of the booklet preview page
 */

import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1200 }
  });

  try {
    // Navigate to booklet page
    await page.goto('http://localhost:3000/flyer/booklet', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for page to fully render
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await page.screenshot({
      path: 'e2e-results/booklet-preview.png',
      fullPage: true
    });

    console.log('Screenshot saved to e2e-results/booklet-preview.png');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

main();
