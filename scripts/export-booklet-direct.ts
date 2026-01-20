/**
 * Direct Booklet Export to Downloads Folder
 *
 * Uses Playwright to capture the booklet sheets and save them directly
 * to the user's Downloads folder as PDF and PNG files.
 */

import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { jsPDF } from 'jspdf';

// Use port 3001 since 3000 is in use
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const BOOKLET_PATH = '/flyer/booklet';

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
  console.log('  Pizza Falchi Booklet Export');
  console.log('==========================================');
  console.log(`\nBase URL: ${BASE_URL}`);

  const downloadsFolder = getDownloadsFolder();
  console.log(`Downloads folder: ${downloadsFolder}\n`);

  // Launch browser in headless mode for faster export
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1200 },
  });
  const page = await context.newPage();

  try {
    console.log('📄 Loading booklet page...');
    await page.goto(`${BASE_URL}${BOOKLET_PATH}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for content to fully render
    await page.waitForSelector('[data-sheet="outside"]', { timeout: 15000 });
    await page.waitForSelector('[data-sheet="inside"]', { timeout: 15000 });
    await page.waitForTimeout(2000);

    console.log('✅ Booklet page loaded\n');

    // ========== PNG Export (Recto) ==========
    console.log('📸 Capturing Recto (Outside Sheet)...');
    const outsideSheet = page.locator('[data-sheet="outside"]');
    const rectoPath = path.join(downloadsFolder, 'pizza-falchi-booklet-recto.png');

    await outsideSheet.screenshot({
      path: rectoPath,
      type: 'png',
    });

    const rectoStats = fs.statSync(rectoPath);
    console.log(`   ✅ Saved: pizza-falchi-booklet-recto.png (${formatSize(rectoStats.size)})`);

    // ========== PNG Export (Verso) ==========
    console.log('📸 Capturing Verso (Inside Sheet)...');
    const insideSheet = page.locator('[data-sheet="inside"]');
    const versoPath = path.join(downloadsFolder, 'pizza-falchi-booklet-verso.png');

    await insideSheet.screenshot({
      path: versoPath,
      type: 'png',
    });

    const versoStats = fs.statSync(versoPath);
    console.log(`   ✅ Saved: pizza-falchi-booklet-verso.png (${formatSize(versoStats.size)})`);

    // ========== PDF Export ==========
    console.log('\n📄 Generating PDF from PNG images...');

    const pdfPath = path.join(downloadsFolder, 'pizza-falchi-booklet.pdf');

    // Create PDF with jsPDF - A4 landscape format
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // A4 landscape dimensions in mm
    const pageWidth = 297;
    const pageHeight = 210;

    // Add recto (outside sheet) as first page
    const rectoData = fs.readFileSync(rectoPath);
    const rectoBase64 = `data:image/png;base64,${rectoData.toString('base64')}`;
    pdf.addImage(rectoBase64, 'PNG', 0, 0, pageWidth, pageHeight);

    // Add verso (inside sheet) as second page
    pdf.addPage('a4', 'landscape');
    const versoData = fs.readFileSync(versoPath);
    const versoBase64 = `data:image/png;base64,${versoData.toString('base64')}`;
    pdf.addImage(versoBase64, 'PNG', 0, 0, pageWidth, pageHeight);

    // Save PDF
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    fs.writeFileSync(pdfPath, pdfBuffer);

    const pdfStats = fs.statSync(pdfPath);
    console.log(`   ✅ Saved: pizza-falchi-booklet.pdf (${formatSize(pdfStats.size)})`);

    // Summary
    console.log('\n==========================================');
    console.log('  Export Complete!');
    console.log('==========================================');
    console.log('\nFiles saved to your Downloads folder:');
    console.log(`  📄 pizza-falchi-booklet.pdf (${formatSize(pdfStats.size)})`);
    console.log(`  🖼️  pizza-falchi-booklet-recto.png (${formatSize(rectoStats.size)})`);
    console.log(`  🖼️  pizza-falchi-booklet-verso.png (${formatSize(versoStats.size)})`);
    console.log(`\nLocation: ${downloadsFolder}`);
    console.log('==========================================\n');

  } catch (error) {
    console.error('\n❌ Export failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
