/**
 * Opens the booklet page for manual export to Downloads folder
 * The browser will automatically save exports to your Downloads folder
 */

import { chromium } from 'playwright';

async function main() {
  console.log('🚀 Opening booklet page for export...\n');
  console.log('The exports will be saved to your browser\'s default Downloads folder.');
  console.log('');

  const browser = await chromium.launch({
    headless: false, // Open visible browser
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  });

  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3000/flyer/booklet', {
      waitUntil: 'networkidle',
    });

    console.log('✅ Booklet page opened!');
    console.log('');
    console.log('Instructions:');
    console.log('1. Click "PDF Impression" to export PDF (will go to Downloads)');
    console.log('2. Click "PNG Web" to export PNG files (will go to Downloads)');
    console.log('');
    console.log('Press Ctrl+C in this terminal when done to close the browser.');

    // Keep browser open until manually closed
    await new Promise(() => {}); // Wait forever

  } catch (error) {
    console.error('Error:', error);
    await browser.close();
  }
}

main();
