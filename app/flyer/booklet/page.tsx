'use client';

import { useRef, useState } from 'react';
import {
  BookletContainer,
  BookletOutsideSheet,
  BookletInsideSheet,
} from '@/components/flyer/booklet';
import { BOOKLET_COLORS } from '@/lib/flyer/bookletDimensions';
import {
  exportBookletToPDF,
  exportBookletSheetsToPNG,
} from '@/lib/flyer/bookletExport';
import {
  FileDown,
  Image as ImageIcon,
  Eye,
  Layers,
  BookOpen,
  Loader2,
  Check,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewMode = 'pages' | 'sheets' | 'spread';
type PageNumber = 1 | 2 | 3 | 4;

const ZOOM_LEVELS = [40, 50, 65, 75, 90, 100];

export default function BookletPreviewPage() {
  const outsideSheetRef = useRef<HTMLDivElement>(null);
  const insideSheetRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('sheets');
  const [currentPage, setCurrentPage] = useState<PageNumber>(1);
  const [showFoldLine, setShowFoldLine] = useState(true);
  const [zoomIndex, setZoomIndex] = useState(3); // 75% default
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'png' | null>(null);

  const zoom = ZOOM_LEVELS[zoomIndex];

  const handleExportPDF = async () => {
    if (!outsideSheetRef.current || !insideSheetRef.current) return;

    setIsExporting(true);
    setExportType('pdf');

    // Temporarily hide fold line for clean export
    const prevFoldLine = showFoldLine;
    setShowFoldLine(false);

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const result = await exportBookletToPDF(
        outsideSheetRef.current,
        insideSheetRef.current,
        { quality: 'print' }
      );

      if (result.success) {
        toast.success('PDF exporté avec succès!');
      } else {
        toast.error(`Erreur: ${result.error}`);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setShowFoldLine(prevFoldLine);
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleExportPNG = async () => {
    if (!outsideSheetRef.current || !insideSheetRef.current) return;

    setIsExporting(true);
    setExportType('png');

    const prevFoldLine = showFoldLine;
    setShowFoldLine(false);

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const result = await exportBookletSheetsToPNG(
        outsideSheetRef.current,
        insideSheetRef.current,
        { quality: 'web' }
      );

      if (result.success) {
        toast.success('PNG exportés avec succès!');
      } else {
        toast.error(`Erreur: ${result.error}`);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'export PNG');
    } finally {
      setShowFoldLine(prevFoldLine);
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleZoomIn = () => {
    if (zoomIndex < ZOOM_LEVELS.length - 1) {
      setZoomIndex(zoomIndex + 1);
    }
  };

  const handleZoomOut = () => {
    if (zoomIndex > 0) {
      setZoomIndex(zoomIndex - 1);
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: '#F5F0E8' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: BOOKLET_COLORS.primaryRed }}
          >
            Booklet Pizza Falchi
          </h1>
          <p style={{ color: BOOKLET_COLORS.textMuted }}>
            Format A4 plié en A5 (148×210mm) • 4 pages
          </p>
        </div>

        {/* Controls */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl mb-6"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* View Mode */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: BOOKLET_COLORS.textBrown }}>
              Vue:
            </span>
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: BOOKLET_COLORS.softYellow }}>
              <button
                onClick={() => setViewMode('sheets')}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  viewMode === 'sheets' ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: viewMode === 'sheets' ? BOOKLET_COLORS.primaryRed : 'transparent',
                  color: viewMode === 'sheets' ? 'white' : BOOKLET_COLORS.textBrown,
                }}
              >
                <Layers size={14} />
                Feuilles
              </button>
              <button
                onClick={() => setViewMode('spread')}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  viewMode === 'spread' ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: viewMode === 'spread' ? BOOKLET_COLORS.primaryRed : 'transparent',
                  color: viewMode === 'spread' ? 'white' : BOOKLET_COLORS.textBrown,
                }}
              >
                <BookOpen size={14} />
                Intérieur
              </button>
              <button
                onClick={() => setViewMode('pages')}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  viewMode === 'pages' ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: viewMode === 'pages' ? BOOKLET_COLORS.primaryRed : 'transparent',
                  color: viewMode === 'pages' ? 'white' : BOOKLET_COLORS.textBrown,
                }}
              >
                <Eye size={14} />
                Pages
              </button>
            </div>
          </div>

          {/* Page Navigation (only in pages mode) */}
          {viewMode === 'pages' && (
            <div className="flex items-center gap-2">
              {([1, 2, 3, 4] as PageNumber[]).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: currentPage === page ? BOOKLET_COLORS.primaryRed : `${BOOKLET_COLORS.softYellow}50`,
                    color: currentPage === page ? 'white' : BOOKLET_COLORS.textBrown,
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoomIndex === 0}
              className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: `${BOOKLET_COLORS.softYellow}30` }}
            >
              <ZoomOut size={16} color={BOOKLET_COLORS.textBrown} />
            </button>
            <span className="text-sm font-medium w-12 text-center" style={{ color: BOOKLET_COLORS.textBrown }}>
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomIndex === ZOOM_LEVELS.length - 1}
              className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: `${BOOKLET_COLORS.softYellow}30` }}
            >
              <ZoomIn size={16} color={BOOKLET_COLORS.textBrown} />
            </button>
          </div>

          {/* Fold Line Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFoldLine}
              onChange={(e) => setShowFoldLine(e.target.checked)}
              className="sr-only"
            />
            <div
              className="w-10 h-5 rounded-full relative transition-colors"
              style={{
                backgroundColor: showFoldLine ? BOOKLET_COLORS.primaryYellow : '#ddd',
              }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                style={{
                  transform: showFoldLine ? 'translateX(20px)' : 'translateX(2px)',
                }}
              />
            </div>
            <span className="text-sm" style={{ color: BOOKLET_COLORS.textBrown }}>
              Ligne de pli
            </span>
          </label>

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
              style={{ backgroundColor: BOOKLET_COLORS.primaryRed }}
              data-testid="export-pdf-button"
            >
              {isExporting && exportType === 'pdf' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileDown size={16} />
              )}
              PDF Impression
            </button>
            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
              style={{ backgroundColor: BOOKLET_COLORS.primaryYellowDark }}
              data-testid="export-png-button"
            >
              {isExporting && exportType === 'png' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ImageIcon size={16} />
              )}
              PNG Web
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div
          className="rounded-xl p-8 overflow-auto"
          style={{
            backgroundColor: '#E8E0D5',
            minHeight: '600px',
          }}
        >
          <div
            className="inline-block origin-top-left transition-transform"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {viewMode === 'sheets' ? (
              <div className="flex flex-col gap-8">
                {/* Outside Sheet (hidden ref for export) */}
                <div>
                  <div
                    className="text-sm font-medium mb-2"
                    style={{ color: BOOKLET_COLORS.textMuted }}
                  >
                    Feuille Extérieure (Recto) - Pages 4 + 1
                  </div>
                  <div ref={outsideSheetRef}>
                    <BookletOutsideSheet showFoldLine={showFoldLine} />
                  </div>
                </div>

                {/* Inside Sheet */}
                <div>
                  <div
                    className="text-sm font-medium mb-2"
                    style={{ color: BOOKLET_COLORS.textMuted }}
                  >
                    Feuille Intérieure (Verso) - Pages 2 + 3
                  </div>
                  <div ref={insideSheetRef}>
                    <BookletInsideSheet showFoldLine={showFoldLine} />
                  </div>
                </div>
              </div>
            ) : viewMode === 'spread' ? (
              <div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{ color: BOOKLET_COLORS.textMuted }}
                >
                  Vue Intérieur Ouvert - Pages 2 + 3
                </div>
                <BookletContainer viewMode="spread" showFoldLine={showFoldLine} />
              </div>
            ) : (
              <div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{ color: BOOKLET_COLORS.textMuted }}
                >
                  Page {currentPage}
                </div>
                <BookletContainer viewMode="pages" currentPage={currentPage} />
              </div>
            )}
          </div>
        </div>

        {/* Hidden refs for export when not in sheets mode */}
        {viewMode !== 'sheets' && (
          <div className="hidden">
            <div ref={outsideSheetRef}>
              <BookletOutsideSheet showFoldLine={false} />
            </div>
            <div ref={insideSheetRef}>
              <BookletInsideSheet showFoldLine={false} />
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: BOOKLET_COLORS.textMuted }}>
            <strong>Instructions d&apos;impression:</strong> Imprimer les 2 feuilles en recto-verso,
            puis plier en deux pour obtenir un booklet A5.
          </p>
        </div>
      </div>
    </div>
  );
}
