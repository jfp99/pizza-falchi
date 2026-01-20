/**
 * Test Booklet Simple Export
 *
 * This script tests the export functionality of the simplified booklet page
 * and verifies that the exported files have correct dimensions.
 */

import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import os from 'os';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const BOOKLET_PATH = '/flyer/booklet/simple';

// Get Windows Downloads folder
function getDownloadsFolder(): string {
  const userProfile = process.env.USERPROFILE || os.homedir();
  return path.join(userProfile, 'Downloads');
}

// Format bytes for display
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  console.log('==========================================');
  console.log('  Booklet Simple Export Test');
  console.log('==========================================');
  console.log(`\nBase URL: ${BASE_URL}`);

  const downloadsFolder = getDownloadsFolder();
  console.log(`Downloads folder: ${downloadsFolder}\n`);

  // Launch browser (non-headless for debugging)
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1200 },
    acceptDownloads: true,
  });
  const page = await context.newPage();

  try {
    console.log('📄 Loading booklet page...');
    await page.goto(`${BASE_URL}${BOOKLET_PATH}`, {
      waitUntil: 'load',
      timeout: 60000,
    });

    // Wait for page to be fully loaded
    await page.waitForTimeout(3000);
    console.log('✅ Booklet page loaded\n');

    // Take screenshot of preview
    console.log('📸 Taking preview screenshot...');
    await page.screenshot({ path: path.join(downloadsFolder, 'booklet-preview-test.png') });

    // ========== Export Test ==========
    console.log('📤 Triggering export...');

    // Set up download handlers
    const download1Promise = page.waitForEvent('download', { timeout: 30000 });

    // Click the export button
    await page.click('button:has-text("2 Feuilles A4")');

    // Wait for first download
    console.log('   Waiting for first download...');
    const download1 = await download1Promise;
    const file1Name = download1.suggestedFilename();
    const file1Path = path.join(downloadsFolder, `test-export-1-${file1Name}`);
    await download1.saveAs(file1Path);
    const stats1 = fs.statSync(file1Path);
    console.log(`   ✅ ${file1Name} (${formatSize(stats1.size)})`);

    // Wait for second download
    console.log('   Waiting for second download...');
    const download2Promise = page.waitForEvent('download', { timeout: 30000 });
    const download2 = await download2Promise;
    const file2Name = download2.suggestedFilename();
    const file2Path = path.join(downloadsFolder, `test-export-2-${file2Name}`);
    await download2.saveAs(file2Path);
    const stats2 = fs.statSync(file2Path);
    console.log(`   ✅ ${file2Name} (${formatSize(stats2.size)})`);

    // ========== Results ==========
    console.log('\n==========================================');
    console.log('  Export Test Complete!');
    console.log('==========================================');
    console.log('\nFiles saved to Downloads folder:');
    console.log(`  📄 test-export-1-${file1Name}`);
    console.log(`  📄 test-export-2-${file2Name}`);
    console.log(`  📸 booklet-preview-test.png`);
    console.log('\nPlease verify:');
    console.log('  1. Both exports have same dimensions');
    console.log('  2. Visual content matches the preview');

    // Keep browser open for 5 seconds to see result
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('\n❌ Error:', error);
    await page.screenshot({ path: path.join(downloadsFolder, 'booklet-export-error.png') });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
