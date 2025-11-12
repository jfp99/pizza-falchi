const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '..', 'public', 'images', 'branding', 'logo-badge.png');
const outputDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'app');

async function generateFavicons() {
  console.log('Generating favicons from logo-badge.png...\n');

  try {
    // Read the source image
    const image = sharp(sourceImage);
    const metadata = await image.metadata();
    console.log(`Source image: ${metadata.width}x${metadata.height}\n`);

    // Generate favicon.ico sizes (multi-resolution ICO)
    // ICO typically contains 16x16, 32x32, 48x48
    await image
      .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-48x48.png'));
    console.log('✓ Generated favicon-48x48.png');

    await image
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-32x32.png'));
    console.log('✓ Generated favicon-32x32.png');

    await image
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-16x16.png'));
    console.log('✓ Generated favicon-16x16.png');

    // Generate apple-touch-icon (180x180)
    await image
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 249, b: 240, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png (180x180)');

    // Generate larger touch icons for Android
    await image
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 249, b: 240, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'android-chrome-192x192.png'));
    console.log('✓ Generated android-chrome-192x192.png');

    await image
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 249, b: 240, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'android-chrome-512x512.png'));
    console.log('✓ Generated android-chrome-512x512.png');

    // Generate a single 32x32 favicon.ico for the app directory
    await image
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(appDir, 'favicon.png'));
    console.log('✓ Generated app/favicon.png (32x32)');

    // Generate OG image (1200x630) for social sharing
    await image
      .resize(1200, 630, { fit: 'contain', background: { r: 255, g: 249, b: 240, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'images', 'og-image-new.png'));
    console.log('✓ Generated og-image-new.png (1200x630)');

    console.log('\n✅ All favicons generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the generated favicons in the /public directory');
    console.log('2. Update the metadata in app/layout.tsx');
    console.log('3. Update the manifest.json file');

  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
