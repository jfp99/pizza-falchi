/**
 * Flyer Export Utilities - Pizza Falchi
 * PDF and PNG export functionality using html2canvas and jspdf
 * Supports both A5 portrait and A4 landscape formats
 *
 * IMPORTANT: Uses proper DPI calculations and image preloading for print quality
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// A5 dimensions (portrait)
const A5_WIDTH_MM = 148;
const A5_HEIGHT_MM = 210;
const A5_WIDTH_PX = 559; // at 96 DPI
const A5_HEIGHT_PX = 794; // at 96 DPI

// A4 dimensions (landscape)
const A4_WIDTH_MM = 297;
const A4_HEIGHT_MM = 210;
const A4_WIDTH_PX = 1118; // at 96 DPI
const A4_HEIGHT_PX = 794; // at 96 DPI

// DPI scale factors for true print quality
// 96 DPI is standard screen, 300 DPI is standard print
// Scale = Target DPI / Base DPI = 300/96 ≈ 3.125
const SCALE_300_DPI = 3.125;
const SCALE_HIGH_QUALITY = 4; // For extra crisp exports

export interface ExportOptions {
  format: 'pdf' | 'png';
  quality: 'print' | 'web';
  filename?: string;
}

export interface ExportResult {
  success: boolean;
  filename?: string;
  error?: string;
}

/**
 * Pre-load all images in a DOM element to ensure they're ready for export
 * This prevents blank/missing images in the exported PDF/PNG
 */
async function preloadFlyerImages(element: HTMLElement): Promise<void> {
  // Get all img elements
  const imageElements = element.querySelectorAll('img');
  const backgroundImages = getAllBackgroundImages(element);

  const allImageSrcs = [
    ...Array.from(imageElements).map(img => img.src),
    ...backgroundImages,
  ];

  const imagePromises = allImageSrcs.map(src => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Don't fail, just continue
      img.crossOrigin = 'anonymous';
      img.src = src;
    });
  });

  // Wait for all images with timeout
  await Promise.race([
    Promise.all(imagePromises),
    new Promise<void>((resolve) => setTimeout(resolve, 10000)), // 10s timeout
  ]);

  // Additional delay to ensure rendering is complete
  await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * Extract all background image URLs from computed styles
 */
function getAllBackgroundImages(element: HTMLElement): string[] {
  const images: string[] = [];
  const allElements = element.querySelectorAll('*');

  allElements.forEach((el) => {
    const style = window.getComputedStyle(el);
    const bgImage = style.backgroundImage;
    if (bgImage && bgImage !== 'none') {
      const matches = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (matches?.[1]) {
        images.push(matches[1]);
      }
    }
  });

  return images;
}

/**
 * Apply font smoothing and text rendering optimizations to cloned document
 * This ensures crisp text in the exported canvas
 */
function applyFontSmoothingToClone(clonedDocument: Document): void {
  const style = clonedDocument.createElement('style');
  style.innerHTML = `
    * {
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: geometricPrecision !important;
      font-feature-settings: "kern" 1 !important;
    }
    img {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
  `;
  clonedDocument.head.appendChild(style);

  // Ensure all images have crossOrigin set
  const images = clonedDocument.querySelectorAll('img');
  images.forEach((img) => {
    img.crossOrigin = 'anonymous';
  });
}

/**
 * Export flyer to PDF format
 * Optimized for A5 print quality (300 DPI)
 */
export async function exportFlyerToPDF(
  element: HTMLElement,
  options: Partial<ExportOptions> = {}
): Promise<ExportResult> {
  const {
    quality = 'print',
    filename = 'pizza-falchi-flyer.pdf',
  } = options;

  try {
    // Scale factor for quality (3 = ~300 DPI for print)
    const scale = quality === 'print' ? 3 : 2;

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: '#FEFCF8', // Match flyer background
      logging: false,
      windowWidth: A5_WIDTH_PX,
      windowHeight: A5_HEIGHT_PX,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, A5_WIDTH_MM, A5_HEIGHT_MM);
    pdf.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error('PDF export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Export flyer to PNG format
 * Suitable for web and social media
 */
export async function exportFlyerToPNG(
  element: HTMLElement,
  options: Partial<ExportOptions> = {}
): Promise<ExportResult> {
  const {
    quality = 'print',
    filename = 'pizza-falchi-flyer.png',
  } = options;

  try {
    const scale = quality === 'print' ? 4 : 2;

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#FEFCF8',
      logging: false,
      windowWidth: A5_WIDTH_PX,
      windowHeight: A5_HEIGHT_PX,
      imageTimeout: 15000,
      removeContainer: true,
    });

    // Convert canvas to blob for reliable download
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to create blob'));
      }, 'image/png');
    });

    // Create download link with blob URL
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    console.error('PNG export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get canvas data URL without downloading
 * Useful for preview or further processing
 */
export async function getFlyerDataURL(
  element: HTMLElement,
  format: 'png' | 'jpeg' = 'png',
  quality: 'print' | 'web' = 'web'
): Promise<string | null> {
  try {
    const scale = quality === 'print' ? 3 : 2;

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: '#FEFCF8',
      logging: false,
    });

    return canvas.toDataURL(
      format === 'jpeg' ? 'image/jpeg' : 'image/png',
      format === 'jpeg' ? 0.95 : undefined
    );
  } catch (error) {
    console.error('Data URL generation error:', error);
    return null;
  }
}

/**
 * Export flyer with automatic format detection
 */
export async function exportFlyer(
  element: HTMLElement,
  options: ExportOptions
): Promise<ExportResult> {
  if (options.format === 'pdf') {
    return exportFlyerToPDF(element, options);
  }
  return exportFlyerToPNG(element, options);
}

// ============================================
// A4 LANDSCAPE EXPORT FUNCTIONS (HIGH QUALITY)
// ============================================

/**
 * Export A4 landscape flyer to PDF format
 * Optimized for print quality with image preloading and font smoothing
 */
export async function exportFlyerA4ToPDF(
  element: HTMLElement,
  options: Partial<ExportOptions> = {}
): Promise<ExportResult> {
  const {
    quality = 'print',
    filename = 'pizza-falchi-flyer-a4.pdf',
  } = options;

  try {
    // Pre-load all images before capture
    await preloadFlyerImages(element);

    // Scale factor: 4x gives ~384 DPI (high quality print)
    const scale = quality === 'print' ? SCALE_HIGH_QUALITY : 2;

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#FDF8F0', // Match flyer cream background
      logging: false,
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
      imageTimeout: 20000, // Extended timeout for images
      removeContainer: true,
      // Critical: Apply font smoothing to the cloned document
      onclone: (clonedDoc) => {
        applyFontSmoothingToClone(clonedDoc);
      },
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: false, // No compression for best quality
    });

    // Use PNG for lossless quality
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');
    pdf.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error('PDF A4 export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Export A4 landscape flyer to PNG format
 * High resolution for web and social media with image preloading
 */
export async function exportFlyerA4ToPNG(
  element: HTMLElement,
  options: Partial<ExportOptions> = {}
): Promise<ExportResult> {
  const {
    quality = 'print',
    filename = 'pizza-falchi-flyer-a4.png',
  } = options;

  try {
    // Pre-load all images before capture
    await preloadFlyerImages(element);

    // Scale factor: 4x gives ~384 DPI (high quality)
    const scale = quality === 'print' ? SCALE_HIGH_QUALITY : 2;

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#FDF8F0',
      logging: false,
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
      imageTimeout: 20000, // Extended timeout for images
      removeContainer: true,
      // Critical: Apply font smoothing to the cloned document
      onclone: (clonedDoc) => {
        applyFontSmoothingToClone(clonedDoc);
      },
    });

    // Convert canvas to blob for reliable download
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to create blob'));
      }, 'image/png');
    });

    // Create download link with blob URL
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    console.error('PNG A4 export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Export A4 flyer with automatic format detection
 */
export async function exportFlyerA4(
  element: HTMLElement,
  options: ExportOptions
): Promise<ExportResult> {
  if (options.format === 'pdf') {
    return exportFlyerA4ToPDF(element, options);
  }
  return exportFlyerA4ToPNG(element, options);
}

/**
 * Get A4 canvas data URL without downloading
 */
export async function getFlyerA4DataURL(
  element: HTMLElement,
  format: 'png' | 'jpeg' = 'png',
  quality: 'print' | 'web' = 'web'
): Promise<string | null> {
  try {
    const scale = quality === 'print' ? 3 : 2;

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: '#FDF8F0',
      logging: false,
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
    });

    return canvas.toDataURL(
      format === 'jpeg' ? 'image/jpeg' : 'image/png',
      format === 'jpeg' ? 0.95 : undefined
    );
  } catch (error) {
    console.error('A4 Data URL generation error:', error);
    return null;
  }
}
