/**
 * Simple Booklet Preview Page - Pizza Falchi
 * Route: /flyer/booklet/simple
 * 4-page booklet: Cover + Menu Spread + Back Cover
 */

'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  BookletCoverFront,
  BookletMenuSpread,
  BookletCoverBack,
  BookletCoverSpread,
  BOOKLET_COVER_FRONT_DIMENSIONS,
  BOOKLET_MENU_SPREAD_DIMENSIONS,
  BOOKLET_COVER_SPREAD_DIMENSIONS,
} from '@/components/flyer/booklet';

type ViewMode = 'all' | 'cover-front' | 'menu' | 'cover-back' | 'print-sheets';
type ExportQuality = 'print' | 'web';

// Icons
function ArrowLeftIcon({ size = 20 }: { size?: number }) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

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
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ZoomIcon({ size = 16 }: { size?: number }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}

export default function SimpleBookletPage() {
  const coverFrontRef = useRef<HTMLDivElement>(null);
  const menuSpreadRef = useRef<HTMLDivElement>(null);
  const coverBackRef = useRef<HTMLDivElement>(null);
  const coverSpreadRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('print-sheets');
  const [scale, setScale] = useState(0.5);
  const [showFoldLine, setShowFoldLine] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const scaleOptions = [0.3, 0.4, 0.5, 0.65, 0.75];

  // Export single page to PNG
  const exportToPNG = async (
    element: HTMLElement,
    filename: string
  ) => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFBF5',
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      return { success: true, filename };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  };

  // Export print sheets (2 A4 pages)
  const handleExportPrintSheets = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Export des feuilles impression...');

    try {
      const prevFoldLine = showFoldLine;
      setShowFoldLine(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Export both A4 sheets
      if (coverSpreadRef.current) {
        await exportToPNG(coverSpreadRef.current, 'booklet-feuille1-exterieur.png');
      }
      if (menuSpreadRef.current) {
        await exportToPNG(menuSpreadRef.current, 'booklet-feuille2-interieur.png');
      }

      setShowFoldLine(prevFoldLine);
      toast.success('2 feuilles A4 exportées!', { id: toastId });
    } catch {
      toast.error("Erreur lors de l'export", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  // Export all pages separately
  const handleExportAll = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Export en cours...');

    try {
      const prevFoldLine = showFoldLine;
      setShowFoldLine(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Export each page
      if (coverFrontRef.current) {
        await exportToPNG(coverFrontRef.current, 'booklet-page1-cover-front.png');
      }
      if (menuSpreadRef.current) {
        await exportToPNG(menuSpreadRef.current, 'booklet-pages2-3-menu.png');
      }
      if (coverBackRef.current) {
        await exportToPNG(coverBackRef.current, 'booklet-page4-cover-back.png');
      }

      setShowFoldLine(prevFoldLine);
      toast.success('Booklet exporté avec succès!', { id: toastId });
    } catch {
      toast.error("Erreur lors de l'export", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: '#F5F0E8' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/flyer"
            className="inline-flex items-center gap-2 text-sm font-medium mb-4 transition-colors hover:opacity-70"
            style={{ color: '#4A3F35' }}
          >
            <ArrowLeftIcon size={18} />
            <span>Retour aux flyers</span>
          </Link>

          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: '#1A1410' }}
          >
            Booklet Pizza Falchi
          </h1>
          <p style={{ color: '#4A3F35' }}>
            Format A5 (148mm x 210mm) - 4 pages pliables
          </p>
        </header>

        {/* Controls Section */}
        <section
          className="p-6 rounded-xl mb-8"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6DED0' }}
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            {/* Export Controls */}
            <div>
              <h2
                className="text-sm font-semibold uppercase tracking-wide mb-3"
                style={{ color: '#C41E1A' }}
              >
                Exporter le booklet
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportPrintSheets}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                  style={{
                    backgroundColor: '#C41E1A',
                    color: '#FFFFFF',
                  }}
                >
                  <DownloadIcon size={16} />
                  2 Feuilles A4 (Impression)
                </button>
                <button
                  onClick={handleExportAll}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                  style={{
                    backgroundColor: '#B8860B',
                    color: '#FFFFFF',
                  }}
                >
                  <DownloadIcon size={16} />
                  Pages séparées (PNG)
                </button>
              </div>
            </div>

            {/* View Mode */}
            <div>
              <h2
                className="text-sm font-semibold uppercase tracking-wide mb-2"
                style={{ color: '#C41E1A' }}
              >
                Vue
              </h2>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'print-sheets', label: 'Feuilles Impression' },
                  { key: 'all', label: 'Pages Séparées' },
                  { key: 'cover-front', label: 'Page 1' },
                  { key: 'menu', label: 'Pages 2-3' },
                  { key: 'cover-back', label: 'Page 4' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setViewMode(key as ViewMode)}
                    className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor: viewMode === key ? '#C41E1A' : '#F9F3E6',
                      color: viewMode === key ? '#FFFFFF' : '#4A3F35',
                      border: '1px solid',
                      borderColor: viewMode === key ? '#C41E1A' : '#E6DED0',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Fold Line Toggle (for menu) */}
              <label className="flex items-center gap-2 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={showFoldLine}
                  onChange={(e) => setShowFoldLine(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                  style={{ accentColor: '#C41E1A' }}
                />
                <span className="text-sm" style={{ color: '#4A3F35' }}>
                  Afficher ligne de pliure (menu)
                </span>
              </label>
            </div>

            {/* Zoom Control */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ZoomIcon size={16} />
                <span className="text-sm" style={{ color: '#4A3F35' }}>
                  Zoom: {Math.round(scale * 100)}%
                </span>
              </div>
              <div className="flex gap-1">
                {scaleOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className="px-2 py-1 text-xs rounded transition-colors"
                    style={{
                      backgroundColor: scale === s ? '#C41E1A' : '#F9F3E6',
                      color: scale === s ? '#FFFFFF' : '#4A3F35',
                      border: '1px solid',
                      borderColor: scale === s ? '#C41E1A' : '#E6DED0',
                    }}
                  >
                    {Math.round(s * 100)}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Booklet Preview */}
        <section>
          <h2
            className="text-sm font-semibold uppercase tracking-wide mb-4"
            style={{ color: '#C41E1A' }}
          >
            Aperçu du booklet
          </h2>

          <div
            className="rounded-xl p-8 overflow-auto"
            style={{ backgroundColor: '#E6DED0' }}
          >
            <div className="flex flex-wrap gap-8 justify-center">
              {/* PRINT SHEETS VIEW - Two A4 sheets for printing */}
              {viewMode === 'print-sheets' && (
                <>
                  {/* Sheet 1: Cover Spread (Page 4 + Page 1) */}
                  <div className="flex flex-col items-center">
                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: '#4A3F35' }}
                    >
                      Feuille 1 - Extérieur (Pages 4 + 1)
                    </p>
                    <div
                      ref={coverSpreadRef}
                      style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <div className="shadow-2xl">
                        <BookletCoverSpread showFoldLine={showFoldLine} />
                      </div>
                    </div>
                  </div>

                  {/* Sheet 2: Menu Spread (Pages 2 + 3) */}
                  <div className="flex flex-col items-center">
                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: '#4A3F35' }}
                    >
                      Feuille 2 - Intérieur (Pages 2 + 3)
                    </p>
                    <div
                      ref={menuSpreadRef}
                      style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <div className="shadow-2xl">
                        <BookletMenuSpread showFoldLine={showFoldLine} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Page 1 - Cover Front */}
              {(viewMode === 'all' || viewMode === 'cover-front') && (
                <div className="flex flex-col items-center">
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: '#4A3F35' }}
                  >
                    Page 1 - Couverture
                  </p>
                  <div
                    ref={coverFrontRef}
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <div className="shadow-2xl">
                      <BookletCoverFront />
                    </div>
                  </div>
                </div>
              )}

              {/* Pages 2-3 - Menu Spread */}
              {(viewMode === 'all' || viewMode === 'menu') && (
                <div className="flex flex-col items-center">
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: '#4A3F35' }}
                  >
                    Pages 2-3 - Menu (intérieur)
                  </p>
                  <div
                    ref={menuSpreadRef}
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <div className="shadow-2xl">
                      <BookletMenuSpread showFoldLine={showFoldLine} />
                    </div>
                  </div>
                </div>
              )}

              {/* Page 4 - Cover Back */}
              {(viewMode === 'all' || viewMode === 'cover-back') && (
                <div className="flex flex-col items-center">
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: '#4A3F35' }}
                  >
                    Page 4 - Dos
                  </p>
                  <div
                    ref={coverBackRef}
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <div className="shadow-2xl">
                      <BookletCoverBack />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Format Info */}
          <div
            className="mt-4 p-4 rounded-lg text-sm"
            style={{ backgroundColor: '#FDF9F0', color: '#4A3F35' }}
          >
            <p className="font-medium mb-1" style={{ color: '#1A1410' }}>
              Instructions d&apos;impression:
            </p>
            {viewMode === 'print-sheets' ? (
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Feuille 1 (Extérieur):</strong> Pages 4 + 1 côte à côte - A4 paysage</li>
                <li><strong>Feuille 2 (Intérieur):</strong> Pages 2 + 3 côte à côte - A4 paysage</li>
                <li>Imprimez les 2 feuilles en recto-verso (retourner sur bord court)</li>
                <li>Pliez en deux pour obtenir le booklet A5</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                <li>Page 1: Couverture avant (A5 portrait)</li>
                <li>Pages 2-3: Menu complet (A4 paysage, pliure au milieu)</li>
                <li>Page 4: Dos avec QR code et informations (A5 portrait)</li>
                <li>Imprimez le menu (pages 2-3) en recto seul</li>
                <li>Collez les pages 1 et 4 au dos du menu plié</li>
              </ul>
            )}
          </div>
        </section>

        {/* Page Details */}
        <section
          className="mt-8 p-6 rounded-xl"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6DED0' }}
        >
          <h2
            className="text-sm font-semibold uppercase tracking-wide mb-3"
            style={{ color: '#C41E1A' }}
          >
            Structure du booklet
          </h2>
          {viewMode === 'print-sheets' ? (
            <div className="grid md:grid-cols-2 gap-6 text-sm" style={{ color: '#4A3F35' }}>
              <div>
                <h3 className="font-medium mb-1" style={{ color: '#1A1410' }}>
                  Feuille 1 - Extérieur (Pages 4 + 1)
                </h3>
                <p>
                  Page 4 (dos avec QR code) à gauche + Page 1 (couverture) à droite.
                  Quand plié, la couverture sera devant et le dos derrière.
                </p>
                <p className="text-xs mt-1 opacity-70">
                  Format: {BOOKLET_COVER_SPREAD_DIMENSIONS.width}×{BOOKLET_COVER_SPREAD_DIMENSIONS.height}px (A4 paysage)
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1" style={{ color: '#1A1410' }}>
                  Feuille 2 - Intérieur (Pages 2 + 3)
                </h3>
                <p>
                  Menu complet avec best-sellers, classiques, crèmes et spécialités.
                  Sera visible quand le booklet est ouvert.
                </p>
                <p className="text-xs mt-1 opacity-70">
                  Format: {BOOKLET_MENU_SPREAD_DIMENSIONS.width}×{BOOKLET_MENU_SPREAD_DIMENSIONS.height}px (A4 paysage)
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4 text-sm" style={{ color: '#4A3F35' }}>
              <div>
                <h3 className="font-medium mb-1" style={{ color: '#1A1410' }}>
                  Page 1 - Couverture
                </h3>
                <p>
                  Image du four à bois, logo Pizza Falchi, tagline &quot;Authentique Pizza
                  Italienne&quot; et numéro de téléphone.
                </p>
                <p className="text-xs mt-1 opacity-70">
                  Format: {BOOKLET_COVER_FRONT_DIMENSIONS.width}×{BOOKLET_COVER_FRONT_DIMENSIONS.height}px (A5)
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1" style={{ color: '#1A1410' }}>
                  Pages 2-3 - Menu
                </h3>
                <p>
                  Menu complet avec best-sellers, classiques, crèmes et spécialités.
                  Pliure centrale pour format booklet.
                </p>
                <p className="text-xs mt-1 opacity-70">
                  Format: {BOOKLET_MENU_SPREAD_DIMENSIONS.width}×{BOOKLET_MENU_SPREAD_DIMENSIONS.height}px (A4)
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1" style={{ color: '#1A1410' }}>
                  Page 4 - Dos
                </h3>
                <p>
                  QR code Google Maps, adresse, horaires, site web et bannière
                  carte de fidélité.
                </p>
                <p className="text-xs mt-1 opacity-70">
                  Format: {BOOKLET_COVER_FRONT_DIMENSIONS.width}×{BOOKLET_COVER_FRONT_DIMENSIONS.height}px (A5)
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
