/**
 * Test script for booklet PNG export functionality
 */

import { chromium, Download } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const DOWNLOADS_DIR = path.join(process.cwd(), 'e2e-results');

async function main() {
  console.log('🚀 Starting Booklet PNG Export Test...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1200 },
    acceptDownloads: true,
  });
  const page = await context.newPage();

  // Track downloads
  const downloads: Download[] = [];
  page.on('download', (download) => {
    downloads.push(download);
    console.log(`   ⬇️ Download: ${download.suggestedFilename()}`);
  });

  try {
    console.log('📄 Navigating to booklet page...');
    await page.goto('http://localhost:3000/flyer/booklet', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForTimeout(3000);
    console.log('✅ Page loaded\n');

    // Find and click PNG export button
    const pngButton = page.locator('button:has-text("PNG Web")');
    await pngButton.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Found PNG button');

    console.log('   Clicking PNG export button...');
    await pngButton.click();

    // Wait for both PNG files to download (recto + verso)
    console.log('   Waiting for PNG generation (2 files)...');
    await page.waitForTimeout(10000);

    // Save all PNG downloads
    console.log('\n📁 Saving PNG files...');
    for (const download of downloads) {
      const filename = download.suggestedFilename();
      if (filename.endsWith('.png')) {
        const savePath = path.join(DOWNLOADS_DIR, filename);
        await download.saveAs(savePath);

        const stats = fs.statSync(savePath);
        const sizeKB = (stats.size / 1024).toFixed(2);

        console.log(`   ✅ ${filename} (${sizeKB} KB)`);
      }
    }

    const pngCount = downloads.filter(d => d.suggestedFilename().endsWith('.png')).length;

    console.log(`\n========== SUMMARY ==========`);
    console.log(`PNG files exported: ${pngCount}`);

    if (pngCount >= 2) {
      console.log('\n✅ PNG export working correctly!');
    } else if (pngCount > 0) {
      console.log('\n⚠️ Only partial PNG export completed');
    } else {
      console.log('\n❌ PNG export failed - no files downloaded');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

main();
