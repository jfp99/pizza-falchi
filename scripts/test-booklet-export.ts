import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function testBookletExport() {
  console.log('🚀 Starting Booklet PDF Export Test...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    acceptDownloads: true,
  });
  const page = await context.newPage();

  try {
    // Navigate to booklet page
    console.log('📄 Navigating to /flyer/booklet...');
    await page.goto('http://localhost:3000/flyer/booklet', { waitUntil: 'networkidle' });

    // Wait for content to load
    console.log('⏳ Waiting for content to render...');
    await page.waitForTimeout(3000);

    // Take screenshot before export
    await page.screenshot({ path: 'e2e-results/booklet-export-before.png', fullPage: true });
    console.log('📸 Screenshot saved: booklet-export-before.png');

    // Find PDF button
    const pdfButton = page.locator('button:has-text("PDF Impression")');
    const isVisible = await pdfButton.isVisible();
    console.log(`🔍 PDF Button visible: ${isVisible}`);

    if (!isVisible) {
      throw new Error('PDF button not found!');
    }

    // Setup download handler
    console.log('⬇️ Setting up download handler...');
    const downloadPromise = page.waitForEvent('download', { timeout: 60000 });

    // Click the button
    console.log('🖱️ Clicking PDF export button...');
    await pdfButton.click();

    // Wait for download
    console.log('⏳ Waiting for PDF generation (this may take a moment)...');
    const download = await downloadPromise;

    // Save the file
    const filename = download.suggestedFilename();
    const downloadPath = path.join('e2e-results', filename);
    await download.saveAs(downloadPath);

    // Check file size
    const stats = fs.statSync(downloadPath);
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log(`\n✅ PDF Export Successful!`);
    console.log(`   📁 File: ${downloadPath}`);
    console.log(`   📊 Size: ${sizeKB} KB`);

    // Take screenshot after
    await page.screenshot({ path: 'e2e-results/booklet-export-after.png' });
    console.log('📸 Screenshot saved: booklet-export-after.png');

  } catch (error) {
    console.error('\n❌ Export failed:', error);
    await page.screenshot({ path: 'e2e-results/booklet-export-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testBookletExport();
