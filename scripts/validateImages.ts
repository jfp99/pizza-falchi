#!/usr/bin/env tsx

/**
 * Image Validation Script
 * Checks which product images exist and which are missing
 * Provides a clear report for image collection progress
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

interface ImageCheck {
  name: string;
  category: string;
  path: string;
  exists: boolean;
  size?: number;
  oversized?: boolean;
}

// Priority products (popular items)
const priorityImages = {
  pizzas: [
    'fromage.jpg',
    'jambon.jpg',
    'regina.jpg',
    '4-fromages.jpg',
    'savoyarde.jpg',
    'kebab.jpg',
    'chevre-miel.jpg',
    'normande.jpg',
    'chicken.jpg',
    'savoyarde-creme.jpg',
    '4-fromages-creme.jpg',
    'chevre-miel-creme.jpg',
    'kebab-creme.jpg',
    'vegetarienne.jpg',
    'mexicana.jpg',
    'orientale.jpg',
    'pagnol.jpg'
  ],
  boissons: [
    'vin-rouge.jpg',
    'vin-rose.jpg',
    'vin-blanc.jpg',
    'heineken.jpg',
    'corona.jpg',
    'san-miguel.jpg',
    'chouffe.jpg',
    'perrier.jpg',
    'coca-cola-bouteille.jpg',
    'cristaline.jpg',
    'soft.jpg',
    'ice-tea-bouteille.jpg'
  ]
};

// All images from database
const allImages = {
  pizzas: [
    'anchois.jpg',
    'fromage.jpg',
    'palermo.jpg',
    'jambon.jpg',
    'venise.jpg',
    'poivron.jpg',
    'regina.jpg',
    'biquette.jpg',
    'roquefort.jpg',
    'champignon.jpg',
    'figatelli.jpg',
    'fruits-mer.jpg',
    '4-fromages.jpg',
    'savoyarde.jpg',
    'kebab.jpg',
    'belzebuth.jpg',
    'chevre-miel.jpg',
    'normande.jpg',
    'dame-blanche.jpg',
    'tonthon.jpg',
    'chicken.jpg',
    'viking.jpg',
    'savoyarde-creme.jpg',
    '4-fromages-creme.jpg',
    'chevre-miel-creme.jpg',
    'kebab-creme.jpg',
    'pagnol.jpg',
    'nicoise.jpg',
    'mexicana.jpg',
    'armenienne.jpg',
    'indienne.jpg',
    'pistou.jpg',
    'vegetarienne.jpg',
    'napoleon.jpg',
    'anti-pasti.jpg',
    'parmesane.jpg',
    'orientale.jpg',
    'justine.jpg',
    'pizza-moment.jpg'
  ],
  boissons: [
    'vin-rouge.jpg',
    'vin-rose.jpg',
    'vin-blanc.jpg',
    'heineken.jpg',
    'corona.jpg',
    'san-miguel.jpg',
    'chouffe.jpg',
    'perrier.jpg',
    'coca-cola-bouteille.jpg',
    'cristaline.jpg',
    'soft.jpg',
    'ice-tea-bouteille.jpg'
  ]
};

const MAX_SIZE = 500 * 1024; // 500KB in bytes

function checkImage(category: string, filename: string): ImageCheck {
  const imagePath = path.join(rootDir, 'public', 'images', 'menu', category, filename);
  const exists = fs.existsSync(imagePath);

  const check: ImageCheck = {
    name: filename,
    category,
    path: `/images/menu/${category}/${filename}`,
    exists
  };

  if (exists) {
    const stats = fs.statSync(imagePath);
    check.size = stats.size;
    check.oversized = stats.size > MAX_SIZE;
  }

  return check;
}

function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

async function main() {
  console.log('\n🔍 PIZZA FALCHI - Image Validation Report\n');
  console.log('=' .repeat(70));

  const results: ImageCheck[] = [];

  // Check priority images first
  console.log('\n📌 PRIORITY IMAGES (Popular Products)\n');

  let priorityExists = 0;
  let priorityTotal = 0;

  for (const [category, images] of Object.entries(priorityImages)) {
    console.log(`\n${category.toUpperCase()}:`);
    for (const image of images) {
      const check = checkImage(category, image);
      results.push(check);
      priorityTotal++;

      if (check.exists) {
        priorityExists++;
        const status = check.oversized ? '⚠️ OVERSIZED' : '✅';
        const sizeInfo = check.size ? ` (${formatSize(check.size)})` : '';
        console.log(`  ${status} ${image}${sizeInfo}`);
      } else {
        console.log(`  ❌ ${image} - MISSING`);
      }
    }
  }

  // Check all other images
  console.log('\n\n📋 ALL IMAGES\n');

  let totalExists = 0;
  let totalCount = 0;

  for (const [category, images] of Object.entries(allImages)) {
    console.log(`\n${category.toUpperCase()}:`);
    for (const image of images) {
      // Skip if already checked in priority
      if (priorityImages[category as keyof typeof priorityImages]?.includes(image)) {
        continue;
      }

      const check = checkImage(category, image);
      results.push(check);
      totalCount++;

      if (check.exists) {
        totalExists++;
        const status = check.oversized ? '⚠️ OVERSIZED' : '✅';
        const sizeInfo = check.size ? ` (${formatSize(check.size)})` : '';
        console.log(`  ${status} ${image}${sizeInfo}`);
      } else {
        console.log(`  ❌ ${image} - MISSING`);
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 SUMMARY\n');

  const grandTotal = priorityTotal + totalCount;
  const grandExists = priorityExists + totalExists;
  const oversized = results.filter(r => r.oversized).length;

  console.log(`Priority Images: ${priorityExists}/${priorityTotal} (${((priorityExists/priorityTotal)*100).toFixed(1)}%)`);
  console.log(`Other Images:    ${totalExists}/${totalCount} (${totalCount > 0 ? ((totalExists/totalCount)*100).toFixed(1) : 0}%)`);
  console.log(`Total Images:    ${grandExists}/${grandTotal} (${((grandExists/grandTotal)*100).toFixed(1)}%)`);

  if (oversized > 0) {
    console.log(`\n⚠️  ${oversized} images exceed 500KB and need compression`);
  }

  const missing = results.filter(r => !r.exists);
  if (missing.length > 0) {
    console.log(`\n❌ ${missing.length} images are missing`);
    console.log('\n📖 See IMAGE_DOWNLOAD_GUIDE.md for download instructions');
  }

  if (grandExists === grandTotal && oversized === 0) {
    console.log('\n✅ All images present and optimized!');
  }

  console.log('\n' + '='.repeat(70) + '\n');
}

main().catch(console.error);
