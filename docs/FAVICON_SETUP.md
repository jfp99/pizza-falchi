# Favicon Setup Documentation

## Overview
The Pizza Falchi favicon system uses the logo badge design to create a cohesive brand experience across all devices and platforms.

## Generated Files

### PNG Favicons (in /public)
- `favicon-16x16.png` - Browser tab icon (16x16)
- `favicon-32x32.png` - Browser tab icon (32x32)
- `favicon-48x48.png` - Browser tab icon (48x48)
- `apple-touch-icon.png` - iOS home screen icon (180x180)
- `android-chrome-192x192.png` - Android icon (192x192)
- `android-chrome-512x512.png` - Android icon (512x512)

### Vector Favicon
- `favicon.svg` - Scalable vector icon for modern browsers

### Additional Files
- `app/favicon.png` - Next.js app directory favicon (32x32)
- `manifest.json` - PWA manifest with icon references

## Design Specifications

### Colors
- **Primary Red:** #D63A3A, #B82828 (starburst gradient)
- **Secondary Red:** #C82333 (borders and accents)
- **Dark Red:** #8B1725 (texture and depth)
- **Cream/Yellow Badge:** #F9E9B8, #F4E1A0, #E8D28A (gradient)
- **Basil Green:** #2D5016, #3D6B20 (background arc)
- **Italian Flag:** #009246 (green), #FFFFFF (white), #CE2B37 (red)
- **Gold Accents:** #E8C474, #D4AF37 (decorative elements)
- **Text Color:** #1a1a1a (black for "PF" letters)

### Design Elements
1. **Star Burst Background:** 24-point red starburst with radial gradient and texture
2. **Gold Decorative Dots:** 16 gold dots around the outer edge for premium look
3. **Top Decorative Arc:** Gold curved arc representing "MAISON DE QUALITÉ" text area
4. **Green Arc:** Basil green ellipse behind the center badge with scrollwork
5. **Center Badge:** Cream ribbon-style oval with horizontal texture lines
6. **"PF" Text:** Bold serif letters in small black font (Pizza Falchi initials)
7. **Italian Flag Shield:** Simplified tricolor shield below the text
8. **Dual Borders:** Gold outer border with darker inner accent

## Regenerating Favicons

### Primary Method (SVG-based with "PF" text)
The main favicon uses a handcrafted SVG design with "PF" initials:

1. Edit `public/favicon.svg` to modify the design
2. Run the generation script:
   ```bash
   npm run generate:favicons
   ```
3. The script will automatically generate all PNG sizes from the SVG

### Alternative Method (Logo-based with "FALCHI" text)
To generate favicons from the original logo badge:

1. Replace `public/images/branding/logo-badge.png` with your new logo
2. Run the legacy generation script:
   ```bash
   npm run generate:favicons:legacy
   ```
3. All sizes will be generated from the PNG logo

## Technical Implementation

### Metadata (app/layout.tsx)
The favicons are configured in the Next.js metadata object with multiple sizes:
- Multiple PNG sizes for browser compatibility
- SVG for modern browsers with vector scaling
- Apple touch icon for iOS devices
- Android chrome icons for Android devices

### PWA Support (manifest.json)
The manifest.json includes:
- App name and description
- Theme colors matching the brand
- Icon references for all sizes
- Display mode set to "standalone" for app-like experience

### Browser Compatibility
- **Modern Browsers:** Use SVG favicon for crisp display at any size
- **Safari/iOS:** Use apple-touch-icon.png (180x180)
- **Android:** Use android-chrome icons (192x192, 512x512)
- **Legacy Browsers:** Fall back to PNG favicons (16x16, 32x32, 48x48)

## Best Practices

### Image Quality
- All PNGs use transparent backgrounds (except touch icons)
- Touch icons have warm cream background (#FFF9F0) matching the site
- Images are optimized for web delivery
- SVG provides infinite scalability

### Accessibility
- High contrast between elements ensures visibility
- The letter "F" is clearly readable even at small sizes
- Color combinations meet WCAG contrast requirements

### Performance
- All images are optimized for fast loading
- SVG is used where supported for smallest file size
- Multiple sizes prevent browser from scaling large images

## Maintenance

### When to Update
- Rebranding or logo changes
- Adding new platform support
- Improving visual quality
- Fixing rendering issues on specific devices

### Quality Checks
After generating new favicons, verify:
- [ ] Browser tab displays correctly (test multiple browsers)
- [ ] iOS home screen icon looks sharp
- [ ] Android home screen icon renders properly
- [ ] SVG displays correctly in modern browsers
- [ ] No pixelation at any size
- [ ] Colors match brand guidelines

## Files Modified

### Configuration
- `app/layout.tsx` - Metadata configuration
- `public/manifest.json` - PWA manifest
- `package.json` - Added generate:favicons script

### Scripts
- `scripts/generateFavicons.js` - Favicon generation script

### Assets
- `public/favicon.svg` - Handcrafted vector favicon
- `public/favicon-*.png` - Generated PNG favicons
- `public/apple-touch-icon.png` - iOS icon
- `public/android-chrome-*.png` - Android icons

---

**Last Updated:** 2025-11-07
**Generated From:** `public/images/branding/logo-badge.png`
