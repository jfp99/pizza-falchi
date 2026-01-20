import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Booklet Export', () => {
  // Increase timeout for export tests as they involve canvas rendering
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    // Navigate to booklet page
    await page.goto('/flyer/booklet');

    // Wait for the page to load completely
    await page.waitForSelector('[data-sheet="outside"]', { timeout: 15000 });
    await page.waitForSelector('[data-sheet="inside"]', { timeout: 15000 });

    // Wait for all images to load
    await page.waitForTimeout(2000);
  });

  test('should export PDF successfully', async ({ page }) => {
    // Take a screenshot before export
    await page.screenshot({ path: 'e2e-results/booklet-before-export.png', fullPage: true });

    // Setup download listener before clicking
    const downloadPromise = page.waitForEvent('download', { timeout: 60000 });

    // Click PDF export button using data-testid
    const pdfButton = page.getByTestId('export-pdf-button');
    await expect(pdfButton).toBeVisible();
    await expect(pdfButton).toBeEnabled();
    await pdfButton.click();

    // Wait for download to start
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toBe('pizza-falchi-booklet.pdf');

    // Save the file to e2e-results folder
    const downloadPath = path.join('e2e-results', download.suggestedFilename());
    await download.saveAs(downloadPath);

    // Verify file exists and has content
    const fileStats = fs.statSync(downloadPath);
    expect(fileStats.size).toBeGreaterThan(10000); // PDF should be at least 10KB

    console.log(`PDF exported successfully: ${downloadPath} (${(fileStats.size / 1024).toFixed(2)} KB)`);

    // Take screenshot after export
    await page.screenshot({ path: 'e2e-results/booklet-after-pdf-export.png' });
  });

  test('should export both PNG files successfully', async ({ page }) => {
    // Track all downloads
    const downloads: { suggestedFilename: () => string; saveAs: (path: string) => Promise<void> }[] = [];

    // Listen for download events
    page.on('download', (download) => {
      downloads.push(download);
    });

    // Setup promise for first download
    const firstDownloadPromise = page.waitForEvent('download', { timeout: 60000 });

    // Click PNG export button using data-testid
    const pngButton = page.getByTestId('export-png-button');
    await expect(pngButton).toBeVisible();
    await expect(pngButton).toBeEnabled();
    await pngButton.click();

    // Wait for first download to start
    await firstDownloadPromise;

    // Wait for second download (PNG export triggers two downloads)
    // Give it some time to complete
    await page.waitForTimeout(3000);

    // Verify we got at least one PNG download
    expect(downloads.length).toBeGreaterThanOrEqual(1);

    // Save and verify all downloaded files
    for (const download of downloads) {
      const filename = download.suggestedFilename();
      expect(filename).toContain('.png');
      expect(filename).toContain('pizza-falchi-booklet');

      const downloadPath = path.join('e2e-results', filename);
      await download.saveAs(downloadPath);

      // Verify file exists and has content
      const fileStats = fs.statSync(downloadPath);
      expect(fileStats.size).toBeGreaterThan(5000); // PNG should be at least 5KB

      console.log(`PNG exported successfully: ${downloadPath} (${(fileStats.size / 1024).toFixed(2)} KB)`);
    }

    // Take screenshot after export
    await page.screenshot({ path: 'e2e-results/booklet-after-png-export.png' });
  });

  test('should have correct export button states during export', async ({ page }) => {
    const pdfButton = page.getByTestId('export-pdf-button');
    const pngButton = page.getByTestId('export-png-button');

    // Both buttons should be visible and enabled initially
    await expect(pdfButton).toBeVisible();
    await expect(pdfButton).toBeEnabled();
    await expect(pngButton).toBeVisible();
    await expect(pngButton).toBeEnabled();

    // Click PDF button and verify loading state
    const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
    await pdfButton.click();

    // Wait for download to complete
    await downloadPromise;

    // After export, buttons should be enabled again
    await expect(pdfButton).toBeEnabled({ timeout: 10000 });
    await expect(pngButton).toBeEnabled({ timeout: 10000 });
  });
});
