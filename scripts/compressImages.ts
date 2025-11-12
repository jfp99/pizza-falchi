#!/usr/bin/env tsx

/**
 * Image Compression Script
 * Automatically compresses images in public/images/menu/ to <500KB
 * Maintains quality while reducing file size
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const MAX_SIZE = 500 * 1024; // 500KB
const TARGET_SIZE = 450 * 1024; // 450KB (buffer for safety)
const MAX_WIDTH = 1200; // Maximum width for images

interface CompressionResult {
  file: string;
  originalSize: number;
  finalSize: number;
  saved: number;
  savedPercent: number;
}

function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

async function compressImage(
  inputPath: string,
  outputPath: string,
  targetSize: number
): Promise<CompressionResult> {
  const originalStats = fs.statSync(inputPath);
  const originalSize = originalStats.size;

  console.log(`  Original: ${formatSize(originalSize)}`);

  // Start with quality 85
  let quality = 85;
  let compressed = false;

  // Resize to reasonable dimensions first
  const metadata = await sharp(inputPath).metadata();
  let width = metadata.width || MAX_WIDTH;

  if (width > MAX_WIDTH) {
    width = MAX_WIDTH;
  }

  // Try compressing with decreasing quality until under target
  while (quality >= 60 && !compressed) {
    await sharp(inputPath)
      .resize(width, undefined, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality, mozjpeg: true })
      .toFile(outputPath + '.temp');

    const tempStats = fs.statSync(outputPath + '.temp');

    if (tempStats.size <= targetSize) {
      fs.renameSync(outputPath + '.temp', outputPath);
      compressed = true;
    } else {
      fs.unlinkSync(outputPath + '.temp');
      quality -= 5;
    }
  }

  if (!compressed) {
    // Last resort: use quality 60
    await sharp(inputPath)
      .resize(width, undefined, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 60, mozjpeg: true })
      .toFile(outputPath);
  }

  const finalStats = fs.statSync(outputPath);
  const finalSize = finalStats.size;
  const saved = originalSize - finalSize;
  const savedPercent = (saved / originalSize) * 100;

  console.log(`  Compressed: ${formatSize(finalSize)} (saved ${formatSize(saved)} - ${savedPercent.toFixed(1)}%)`);

  return {
    file: path.basename(inputPath),
    originalSize,
    finalSize,
    saved,
    savedPercent
  };
}

async function processDirectory(dirPath: string): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];

  if (!fs.existsSync(dirPath)) {
    return results;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
      const fileSize = stats.size;

      if (fileSize > MAX_SIZE) {
        console.log(`\n🔧 Compressing: ${file}`);

        const backupPath = filePath + '.original';
        fs.copyFileSync(filePath, backupPath);

        try {
          const result = await compressImage(filePath, filePath, TARGET_SIZE);
          results.push(result);

          // Delete backup if successful
          fs.unlinkSync(backupPath);
          console.log(`  ✅ Success!`);
        } catch (error) {
          console.error(`  ❌ Failed: ${error}`);
          // Restore from backup
          if (fs.existsSync(backupPath)) {
            fs.copyFileSync(backupPath, filePath);
            fs.unlinkSync(backupPath);
          }
        }
      } else {
        console.log(`\n✅ ${file} - Already optimized (${formatSize(fileSize)})`);
      }
    }
  }

  return results;
}

async function main() {
  console.log('\n🗜️  PIZZA FALCHI - Image Compression Tool\n');
  console.log('=' .repeat(70));
  console.log(`\nTarget: < ${formatSize(MAX_SIZE)} per image\n`);

  const menuPath = path.join(rootDir, 'public', 'images', 'menu');
  const categories = ['pizzas', 'boissons', 'desserts', 'accompagnements'];

  let totalResults: CompressionResult[] = [];

  for (const category of categories) {
    const categoryPath = path.join(menuPath, category);

    if (fs.existsSync(categoryPath)) {
      console.log(`\n📁 Processing ${category}...`);
      const results = await processDirectory(categoryPath);
      totalResults = totalResults.concat(results);
    } else {
      console.log(`\n⏭️  Skipping ${category} (directory not found)`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 COMPRESSION SUMMARY\n');

  if (totalResults.length === 0) {
    console.log('✅ No images needed compression!');
  } else {
    const totalOriginal = totalResults.reduce((sum, r) => sum + r.originalSize, 0);
    const totalFinal = totalResults.reduce((sum, r) => sum + r.finalSize, 0);
    const totalSaved = totalOriginal - totalFinal;
    const totalPercent = (totalSaved / totalOriginal) * 100;

    console.log(`Images compressed: ${totalResults.length}`);
    console.log(`Total original:    ${formatSize(totalOriginal)}`);
    console.log(`Total final:       ${formatSize(totalFinal)}`);
    console.log(`Total saved:       ${formatSize(totalSaved)} (${totalPercent.toFixed(1)}%)`);

    // List compressed files
    console.log('\n📝 Compressed files:');
    totalResults.forEach(r => {
      console.log(`  • ${r.file}: ${formatSize(r.originalSize)} → ${formatSize(r.finalSize)}`);
    });
  }

  console.log('\n' + '='.repeat(70) + '\n');
}

main().catch(console.error);
