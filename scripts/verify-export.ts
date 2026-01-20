/**
 * Verify Booklet Export Functionality
 *
 * This script uses Playwright to test the booklet export features:
 * 1. Opens the booklet page in a visible browser window
 * 2. Clicks the PDF export button and waits for download
 * 3. Clicks the PNG export button and waits for downloads
 * 4. Verifies files appear in the Downloads folder
 *
 * Usage: npx tsx scripts/verify-export.ts
 */

import { chromium } from 'playwright';
import type { Download, Page } from 'playwright';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const BOOKLET_PATH = '/flyer/booklet';
const TIMEOUT = 60000; // 60 seconds for export operations

// Get Windows Downloads folder path
function getDownloadsFolder(): string {
  // On Windows, use the user's Downloads folder
  const userProfile = process.env.USERPROFILE || os.homedir();
  return path.join(userProfile, 'Downloads');
}

// Check if a file exists and has content
function verifyFile(filePath: string, minSize: number = 1000): boolean {
  try {
    const stats = fs.statSync(filePath);
    return stats.size >= minSize;
  } catch {
    return false;
  }
}

// Wait for a file to appear in the downloads folder
async function waitForFile(
  filePath: string,
  timeoutMs: number = 30000
): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (verifyFile(filePath)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

// Format file size for display
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface ExportResult {
  success: boolean;
  filename: string;
  path: string;
  size?: number;
  error?: string;
}

async function testPDFExport(page: Page, downloadsPath: string): Promise<ExportResult> {
  console.log('\n--- Testing PDF Export ---');

  const expectedFilename = 'pizza-falchi-booklet.pdf';
  const expectedPath = path.join(downloadsPath, expectedFilename);

  // Remove existing file if present
  if (fs.existsSync(expectedPath)) {
    console.log(`  Removing existing file: ${expectedFilename}`);
    fs.unlinkSync(expectedPath);
  }

  try {
    // Setup download promise before clicking
    const downloadPromise = page.waitForEvent('download', { timeout: TIMEOUT });

    // Click the PDF export button
    console.log('  Clicking PDF export button...');
    const pdfButton = page.getByTestId('export-pdf-button');
    await pdfButton.click();

    // Wait for download event
    console.log('  Waiting for download to start...');
    const download: Download = await downloadPromise;

    console.log(`  Download started: ${download.suggestedFilename()}`);

    // Save to downloads folder
    await download.saveAs(expectedPath);

    // Wait for file to be fully written
    const fileExists = await waitForFile(expectedPath, 10000);

    if (fileExists) {
      const stats = fs.statSync(expectedPath);
      console.log(`  PDF saved successfully: ${expectedPath}`);
      console.log(`  File size: ${formatSize(stats.size)}`);

      return {
        success: true,
        filename: expectedFilename,
        path: expectedPath,
        size: stats.size,
      };
    } else {
      return {
        success: false,
        filename: expectedFilename,
        path: expectedPath,
        error: 'File not found after download',
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`  PDF export failed: ${errorMessage}`);
    return {
      success: false,
      filename: expectedFilename,
      path: expectedPath,
      error: errorMessage,
    };
  }
}

async function testPNGExport(page: Page, downloadsPath: string): Promise<ExportResult[]> {
  console.log('\n--- Testing PNG Export ---');

  const expectedFiles = [
    'pizza-falchi-booklet-recto.png',
    'pizza-falchi-booklet-verso.png',
  ];
  const results: ExportResult[] = [];

  // Remove existing files if present
  for (const filename of expectedFiles) {
    const filePath = path.join(downloadsPath, filename);
    if (fs.existsSync(filePath)) {
      console.log(`  Removing existing file: ${filename}`);
      fs.unlinkSync(filePath);
    }
  }

  try {
    // Setup download promise for first PNG
    const firstDownloadPromise = page.waitForEvent('download', { timeout: TIMEOUT });

    // Click the PNG export button
    console.log('  Clicking PNG export button...');
    const pngButton = page.getByTestId('export-png-button');
    await pngButton.click();

    // Wait for first download
    console.log('  Waiting for first PNG download...');
    const firstDownload: Download = await firstDownloadPromise;
    console.log(`  First download: ${firstDownload.suggestedFilename()}`);

    // Save first file
    const firstPath = path.join(downloadsPath, firstDownload.suggestedFilename());
    await firstDownload.saveAs(firstPath);

    // Wait for second download (PNG export triggers two downloads)
    console.log('  Waiting for second PNG download...');
    const secondDownloadPromise = page.waitForEvent('download', { timeout: TIMEOUT });
    const secondDownload: Download = await secondDownloadPromise;
    console.log(`  Second download: ${secondDownload.suggestedFilename()}`);

    // Save second file
    const secondPath = path.join(downloadsPath, secondDownload.suggestedFilename());
    await secondDownload.saveAs(secondPath);

    // Verify both files
    for (const filename of expectedFiles) {
      const filePath = path.join(downloadsPath, filename);
      const fileExists = await waitForFile(filePath, 10000);

      if (fileExists) {
        const stats = fs.statSync(filePath);
        console.log(`  PNG saved: ${filePath} (${formatSize(stats.size)})`);
        results.push({
          success: true,
          filename,
          path: filePath,
          size: stats.size,
        });
      } else {
        results.push({
          success: false,
          filename,
          path: filePath,
          error: 'File not found after download',
        });
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`  PNG export failed: ${errorMessage}`);

    // Check what files we got
    for (const filename of expectedFiles) {
      const filePath = path.join(downloadsPath, filename);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        results.push({
          success: true,
          filename,
          path: filePath,
          size: stats.size,
        });
      } else {
        results.push({
          success: false,
          filename,
          path: filePath,
          error: errorMessage,
        });
      }
    }
  }

  return results;
}

async function main() {
  console.log('========================================');
  console.log('  Booklet Export Verification Script');
  console.log('========================================');
  console.log(`\nBase URL: ${BASE_URL}`);

  const downloadsPath = getDownloadsFolder();
  console.log(`Downloads folder: ${downloadsPath}`);

  // Verify downloads folder exists
  if (!fs.existsSync(downloadsPath)) {
    console.error('Downloads folder does not exist!');
    process.exit(1);
  }

  // Launch browser in headed mode (visible window)
  console.log('\nLaunching browser (headed mode)...');
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500, // Slow down for visibility
  });

  const context = await browser.newContext({
    acceptDownloads: true,
  });

  const page = await context.newPage();

  try {
    // Navigate to booklet page
    console.log(`\nNavigating to ${BASE_URL}${BOOKLET_PATH}...`);
    await page.goto(`${BASE_URL}${BOOKLET_PATH}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for page to fully load
    console.log('Waiting for booklet sheets to render...');
    await page.waitForSelector('[data-sheet="outside"]', { timeout: 15000 });
    await page.waitForSelector('[data-sheet="inside"]', { timeout: 15000 });

    console.log('Booklet page loaded successfully!');

    // Give extra time for all images to load
    await page.waitForTimeout(2000);

    // Test PDF export
    const pdfResult = await testPDFExport(page, downloadsPath);

    // Wait between exports
    await page.waitForTimeout(2000);

    // Test PNG export
    const pngResults = await testPNGExport(page, downloadsPath);

    // Print summary
    console.log('\n========================================');
    console.log('  Export Verification Summary');
    console.log('========================================');

    console.log('\nPDF Export:');
    if (pdfResult.success) {
      console.log(`  [SUCCESS] ${pdfResult.filename} (${formatSize(pdfResult.size || 0)})`);
    } else {
      console.log(`  [FAILED] ${pdfResult.filename}: ${pdfResult.error}`);
    }

    console.log('\nPNG Export:');
    for (const result of pngResults) {
      if (result.success) {
        console.log(`  [SUCCESS] ${result.filename} (${formatSize(result.size || 0)})`);
      } else {
        console.log(`  [FAILED] ${result.filename}: ${result.error}`);
      }
    }

    // Overall status
    const allSuccess = pdfResult.success && pngResults.every((r) => r.success);
    console.log('\n----------------------------------------');
    if (allSuccess) {
      console.log('All exports completed successfully!');
      console.log(`Files saved to: ${downloadsPath}`);
    } else {
      console.log('Some exports failed. Check the errors above.');
    }
    console.log('----------------------------------------\n');

    // Keep browser open for a moment to see results
    await page.waitForTimeout(3000);

    process.exit(allSuccess ? 0 : 1);
  } catch (error) {
    console.error('\nFatal error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the verification
main().catch(console.error);
