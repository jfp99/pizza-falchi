import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Flyer Export', () => {
  test('should export A4 flyer to PNG', async ({ page }) => {
    // Navigate to flyer page
    await page.goto('/flyer');
    
    // Wait for the flyer to be fully rendered
    await page.waitForSelector('article[role="document"]');
    
    // Wait a bit for all images to load
    await page.waitForTimeout(2000);
    
    // Take a screenshot of the flyer preview
    const flyerElement = await page.locator('article[role="document"]');
    await flyerElement.screenshot({ path: 'e2e-results/flyer-export-preview.png' });
    
    // Click PNG export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("PNG (Web)")');
    
    const download = await downloadPromise;
    const downloadPath = path.join('e2e-results', download.suggestedFilename());
    await download.saveAs(downloadPath);
    
    // Verify file was downloaded
    expect(fs.existsSync(downloadPath)).toBeTruthy();
    
    console.log(`PNG exported to: ${downloadPath}`);
  });
});
