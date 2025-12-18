/**
 * Flyer Export Controls - Pizza Falchi
 * PDF/PNG export buttons with loading states
 */

'use client';

import React, { useState, RefObject } from 'react';
import { exportFlyerToPDF, exportFlyerToPNG } from '@/lib/flyer/exportUtils';

interface FlyerExportControlsProps {
  flyerRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

// Download icon SVG
function DownloadIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// Spinner icon SVG
function SpinnerIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// FileText icon for PDF
function FileTextIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

// Image icon for PNG
function ImageIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

export default function FlyerExportControls({
  flyerRef,
  className = '',
}: FlyerExportControlsProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExportPDF = async () => {
    if (!flyerRef.current) {
      setError('Flyer element not found');
      return;
    }

    setIsExportingPDF(true);
    setError(null);

    try {
      const result = await exportFlyerToPDF(flyerRef.current, {
        filename: 'pizza-falchi-flyer',
      });

      if (!result.success) {
        setError(result.error || 'Failed to export PDF');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportPNG = async () => {
    if (!flyerRef.current) {
      setError('Flyer element not found');
      return;
    }

    setIsExportingPNG(true);
    setError(null);

    try {
      const result = await exportFlyerToPNG(flyerRef.current, {
        filename: 'pizza-falchi-flyer',
      });

      if (!result.success) {
        setError(result.error || 'Failed to export PNG');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('PNG export error:', err);
    } finally {
      setIsExportingPNG(false);
    }
  };

  const isExporting = isExportingPDF || isExportingPNG;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Export Buttons */}
      <div className="flex gap-3">
        {/* PDF Export Button */}
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#C41E1A',
            color: '#FFFFFF',
          }}
          onMouseEnter={(e) => {
            if (!isExporting) {
              e.currentTarget.style.backgroundColor = '#A31815';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#C41E1A';
          }}
          aria-label="Export flyer as PDF"
        >
          {isExportingPDF ? (
            <SpinnerIcon size={18} />
          ) : (
            <FileTextIcon size={18} />
          )}
          <span>{isExportingPDF ? 'Exporting...' : 'Export PDF'}</span>
          {!isExportingPDF && <DownloadIcon size={16} />}
        </button>

        {/* PNG Export Button */}
        <button
          onClick={handleExportPNG}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#1A1410',
            border: '2px solid #E6DED0',
          }}
          onMouseEnter={(e) => {
            if (!isExporting) {
              e.currentTarget.style.backgroundColor = '#F9F3E6';
              e.currentTarget.style.borderColor = '#D4AF37';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#E6DED0';
          }}
          aria-label="Export flyer as PNG"
        >
          {isExportingPNG ? (
            <SpinnerIcon size={18} />
          ) : (
            <ImageIcon size={18} />
          )}
          <span>{isExportingPNG ? 'Exporting...' : 'Export PNG'}</span>
          {!isExportingPNG && <DownloadIcon size={16} />}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
          role="alert"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Export Info */}
      <p className="text-xs" style={{ color: '#4A3F35' }}>
        PDF: Format A5 (148mm x 210mm) optimise pour impression
        <br />
        PNG: Haute resolution (300 DPI) pour web et partage
      </p>
    </div>
  );
}
