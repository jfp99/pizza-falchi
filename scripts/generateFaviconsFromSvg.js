const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceSvg = path.join(__dirname, '..', 'public', 'favicon.svg');
const outputDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'app');

async function generateFavicons() {
  console.log('Generating favicons from favicon.svg with PF text...\n');

  try {
    // Read the SVG and convert to buffer for processing
    const svgBuffer = fs.readFileSync(sourceSvg);

    // Generate favicon.ico sizes (multi-resolution ICO)
    await sharp(svgBuffer)
      .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-48x48.png'));
    console.log('✓ Generated favicon-48x48.png');

    await sharp(svgBuffer)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-32x32.png'));
    console.log('✓ Generated favicon-32x32.png');

    await sharp(svgBuffer)
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'favicon-16x16.png'));
    console.log('✓ Generated favicon-16x16.png');

    // Generate apple-touch-icon (180x180) with warm cream background
    await sharp(svgBuffer)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 249, b: 240, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png (180x180)');

    // Generate larger touch icons for Android
    await sharp(svgBuffer)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 249, b: 240, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'android-chrome-192x192.png'));
    console.log('✓ Generated android-chrome-192x192.png');

    await sharp(svgBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 249, b: 240, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'android-chrome-512x512.png'));
    console.log('✓ Generated android-chrome-512x512.png');

    // Generate a 32x32 favicon.png for the app directory
    await sharp(svgBuffer)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(appDir, 'favicon.png'));
    console.log('✓ Generated app/favicon.png (32x32)');

    // Generate OG image (1200x630) for social sharing
    await sharp(svgBuffer)
      .resize(1200, 630, { fit: 'contain', background: { r: 255, g: 249, b: 240, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'images', 'og-image-favicon.png'));
    console.log('✓ Generated og-image-favicon.png (1200x630)');

    console.log('\n✅ All favicons with PF text generated successfully from SVG!');
    console.log('\nGenerated files use the new design with:');
    console.log('- Star burst red badge matching the logo');
    console.log('- "PF" text in small black letters');
    console.log('- Italian flag shield');
    console.log('- Gold decorative elements');

  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
