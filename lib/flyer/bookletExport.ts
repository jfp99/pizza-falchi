/**
 * Booklet Export Utilities - Pizza Falchi
 * Multi-page PDF and PNG export for A4 booklet
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  BOOKLET_DIMENSIONS,
  BOOKLET_PRINT_DIMENSIONS,
  EXPORT_QUALITY,
} from './bookletDimensions';
import type { BookletExportOptions, BookletExportResult } from '@/components/flyer/booklet/types';

/**
 * Preload all images within an element
 */
async function preloadImages(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll('img');
  const imagePromises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Continue even if image fails
      // Timeout after 5 seconds
      setTimeout(resolve, 5000);
    });
  });
  await Promise.all(imagePromises);
}

/**
 * Apply font smoothing styles for better text rendering
 */
function applyFontSmoothing(element: HTMLElement): void {
  // Use setProperty for vendor-prefixed properties
  element.style.setProperty('-webkit-font-smoothing', 'antialiased');
  element.style.textRendering = 'geometricPrecision';
  // Apply to all children
  const allElements = element.querySelectorAll('*');
  allElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.setProperty('-webkit-font-smoothing', 'antialiased');
      el.style.textRendering = 'geometricPrecision';
    }
  });
}

/**
 * Capture an element to canvas with high quality settings
 */
async function captureToCanvas(
  element: HTMLElement,
  quality: 'print' | 'web' | 'preview' = 'print'
): Promise<HTMLCanvasElement> {
  await preloadImages(element);

  const qualitySettings = EXPORT_QUALITY[quality];

  // Clone element for capture to avoid modifying original
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  document.body.appendChild(clone);

  applyFontSmoothing(clone);

  // Wait for fonts to load
  await document.fonts.ready;

  // Small delay to ensure rendering is complete
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    const canvas = await html2canvas(clone, {
      scale: qualitySettings.scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FDF8F0', // cream background
      logging: false,
      imageTimeout: 10000,
      onclone: (clonedDoc, clonedElement) => {
        applyFontSmoothing(clonedElement);
      },
    });

    return canvas;
  } finally {
    document.body.removeChild(clone);
  }
}

/**
 * Export booklet as multi-page PDF
 * Creates a 2-page PDF: outside sheet (pages 4+1) and inside sheet (pages 2+3)
 */
export async function exportBookletToPDF(
  outsideSheet: HTMLElement,
  insideSheet: HTMLElement,
  options: Partial<BookletExportOptions> = {}
): Promise<BookletExportResult> {
  const {
    quality = 'print',
    filename = 'pizza-falchi-booklet.pdf',
  } = options;

  try {
    // Create PDF in A4 landscape
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: false, // Best quality
    });

    const { width, height } = BOOKLET_DIMENSIONS.sheet;

    // Capture outside sheet (Recto - Pages 4 + 1)
    const outsideCanvas = await captureToCanvas(outsideSheet, quality);
    const outsideDataUrl = outsideCanvas.toDataURL('image/png', 1.0);
    pdf.addImage(outsideDataUrl, 'PNG', 0, 0, width, height);

    // Add second page for inside sheet (Verso - Pages 2 + 3)
    pdf.addPage('a4', 'landscape');
    const insideCanvas = await captureToCanvas(insideSheet, quality);
    const insideDataUrl = insideCanvas.toDataURL('image/png', 1.0);
    pdf.addImage(insideDataUrl, 'PNG', 0, 0, width, height);

    // Save PDF - triggers browser download
    // jsPDF.save() creates a blob and triggers download via anchor click
    pdf.save(filename);

    // Small delay to ensure download is triggered before returning
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      success: true,
      filename,
    };
  } catch (error) {
    console.error('PDF export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    };
  }
}

/**
 * Export a single sheet as PNG
 */
export async function exportSheetToPNG(
  sheet: HTMLElement,
  options: Partial<BookletExportOptions & { sheetName: string }> = {}
): Promise<BookletExportResult> {
  const {
    quality = 'web',
    sheetName = 'sheet',
    filename = `pizza-falchi-booklet-${sheetName}.png`,
  } = options;

  try {
    const canvas = await captureToCanvas(sheet, quality);

    // Convert to blob and download
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create blob'));
        },
        'image/png',
        1.0
      );
    });

    // Create and trigger download link
    // This method works reliably across modern browsers including Chrome, Firefox, Edge
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);

    // Use setTimeout to ensure the link is in the DOM before clicking
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        link.click();
        resolve();
      }, 0);
    });

    // Clean up after a delay to ensure download has started
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    return {
      success: true,
      filename,
      blob,
    };
  } catch (error) {
    console.error('PNG export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    };
  }
}

/**
 * Export individual pages as separate PNGs (for social media)
 */
export async function exportPagesToPNG(
  pages: HTMLElement[],
  options: Partial<BookletExportOptions> = {}
): Promise<BookletExportResult> {
  const { quality = 'web' } = options;

  try {
    for (let i = 0; i < pages.length; i++) {
      const pageNumber = i + 1;
      const filename = `pizza-falchi-booklet-page${pageNumber}.png`;

      await exportSheetToPNG(pages[i], {
        quality,
        sheetName: `page${pageNumber}`,
        filename,
      });

      // Small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return {
      success: true,
      filename: 'Multiple pages exported',
    };
  } catch (error) {
    console.error('Pages export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    };
  }
}

/**
 * Export both sheets as separate PNGs
 */
export async function exportBookletSheetsToPNG(
  outsideSheet: HTMLElement,
  insideSheet: HTMLElement,
  options: Partial<BookletExportOptions> = {}
): Promise<BookletExportResult> {
  const { quality = 'web' } = options;

  try {
    // Export outside sheet (Recto)
    await exportSheetToPNG(outsideSheet, {
      quality,
      sheetName: 'recto',
      filename: 'pizza-falchi-booklet-recto.png',
    });

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Export inside sheet (Verso)
    await exportSheetToPNG(insideSheet, {
      quality,
      sheetName: 'verso',
      filename: 'pizza-falchi-booklet-verso.png',
    });

    return {
      success: true,
      filename: 'Both sheets exported',
    };
  } catch (error) {
    console.error('Sheets export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    };
  }
}
