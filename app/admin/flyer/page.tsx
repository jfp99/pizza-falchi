/**
 * Admin Flyer Page - Pizza Falchi
 * Route: /admin/flyer
 * 4-page booklet: Cover + Menu Spread + Back Cover
 */

'use client';

import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, ZoomIn, Eye } from 'lucide-react';
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

export default function AdminFlyerPage() {
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
  const exportToPNG = async (element: HTMLElement, filename: string) => {
    try {
      const html2canvas = (await import('html2canvas')).default;

      const width = element.offsetWidth;
      const height = element.offsetHeight;

      const exportContainer = document.createElement('div');
      exportContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: ${width}px;
        height: ${height}px;
        z-index: -9999;
        pointer-events: none;
        transform: none !important;
        background-color: #FFFBF5;
      `;

      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.transition = 'none';
      clone.style.width = `${width}px`;
      clone.style.height = `${height}px`;
      clone.style.position = 'relative';
      clone.style.margin = '0';
      clone.style.padding = '0';

      exportContainer.appendChild(clone);
      document.body.appendChild(exportContainer);

      await new Promise((resolve) => setTimeout(resolve, 100));
      void exportContainer.offsetHeight;

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFBF5',
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
        logging: false,
      });

      document.body.removeChild(exportContainer);

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      return { success: true, filename, width: canvas.width, height: canvas.height };
    } catch (error) {
      console.error('Export error:', error);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Flyer & Booklet
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Format A5 (148mm x 210mm) - 4 pages pliables
        </p>
      </div>

      {/* Controls Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          {/* Export Controls */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3 text-primary-red">
              Exporter le booklet
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportPrintSheets}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-red text-white hover:bg-primary-red-dark transition-all hover:scale-105 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                2 Feuilles A4 (Impression)
              </button>
              <button
                onClick={handleExportAll}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-yellow text-gray-900 hover:bg-primary-yellow-dark transition-all hover:scale-105 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Pages séparées (PNG)
              </button>
            </div>
          </div>

          {/* View Mode */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-2 text-primary-red flex items-center gap-2">
              <Eye className="w-4 h-4" />
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
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                    viewMode === key
                      ? 'bg-primary-red text-white border-primary-red'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary-red'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Fold Line Toggle */}
            <label className="flex items-center gap-2 cursor-pointer mt-3">
              <input
                type="checkbox"
                checked={showFoldLine}
                onChange={(e) => setShowFoldLine(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-red focus:ring-primary-red"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Afficher ligne de pliure (menu)
              </span>
            </label>
          </div>

          {/* Zoom Control */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ZoomIn className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Zoom: {Math.round(scale * 100)}%
              </span>
            </div>
            <div className="flex gap-1">
              {scaleOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`px-2 py-1 text-xs rounded transition-colors border ${
                    scale === s
                      ? 'bg-primary-red text-white border-primary-red'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {Math.round(s * 100)}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booklet Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Aperçu du booklet</h2>
        </div>

        <div className="p-8 bg-gray-100 dark:bg-gray-900 overflow-auto">
          <div className="flex flex-wrap gap-8 justify-center">
            {/* PRINT SHEETS VIEW */}
            {viewMode === 'print-sheets' && (
              <>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                    Feuille 1 - Extérieur (Pages 4 + 1)
                  </p>
                  <div
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <div className="shadow-2xl" ref={coverSpreadRef}>
                      <BookletCoverSpread showFoldLine={showFoldLine} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                    Feuille 2 - Intérieur (Pages 2 + 3)
                  </p>
                  <div
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <div className="shadow-2xl" ref={menuSpreadRef}>
                      <BookletMenuSpread showFoldLine={showFoldLine} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Page 1 - Cover Front */}
            {(viewMode === 'all' || viewMode === 'cover-front') && (
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                  Page 1 - Couverture
                </p>
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <div className="shadow-2xl">
                    <div ref={coverFrontRef}>
                      <BookletCoverFront />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pages 2-3 - Menu Spread */}
            {(viewMode === 'all' || viewMode === 'menu') && (
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                  Pages 2-3 - Menu (intérieur)
                </p>
                <div
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
                <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                  Page 4 - Dos
                </p>
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <div className="shadow-2xl">
                    <div ref={coverBackRef}>
                      <BookletCoverBack />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
          <p className="font-medium mb-2 text-gray-900 dark:text-white">
            Instructions d&apos;impression:
          </p>
          {viewMode === 'print-sheets' ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <strong>Feuille 1 (Extérieur):</strong> Pages 4 + 1 côte à côte - A4 paysage
              </li>
              <li>
                <strong>Feuille 2 (Intérieur):</strong> Pages 2 + 3 côte à côte - A4 paysage
              </li>
              <li>Imprimez les 2 feuilles en recto-verso (retourner sur bord court)</li>
              <li>Pliez en deux pour obtenir le booklet A5</li>
            </ul>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Page 1: Couverture avant (A5 portrait)</li>
              <li>Pages 2-3: Menu complet (A4 paysage, pliure au milieu)</li>
              <li>Page 4: Dos avec QR code et informations (A5 portrait)</li>
            </ul>
          )}
        </div>
      </div>

      {/* Format Details */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3 text-primary-red">
          Structure du booklet
        </h2>
        {viewMode === 'print-sheets' ? (
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-medium mb-1 text-gray-900 dark:text-white">
                Feuille 1 - Extérieur (Pages 4 + 1)
              </h3>
              <p>
                Page 4 (dos avec QR code) à gauche + Page 1 (couverture) à droite. Quand plié, la
                couverture sera devant et le dos derrière.
              </p>
              <p className="text-xs mt-1 opacity-70">
                Format: {BOOKLET_COVER_SPREAD_DIMENSIONS.width}×
                {BOOKLET_COVER_SPREAD_DIMENSIONS.height}px (A4 paysage)
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-900 dark:text-white">
                Feuille 2 - Intérieur (Pages 2 + 3)
              </h3>
              <p>
                Menu complet avec best-sellers, classiques, crèmes et spécialités. Sera visible
                quand le booklet est ouvert.
              </p>
              <p className="text-xs mt-1 opacity-70">
                Format: {BOOKLET_MENU_SPREAD_DIMENSIONS.width}×
                {BOOKLET_MENU_SPREAD_DIMENSIONS.height}px (A4 paysage)
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-medium mb-1 text-gray-900 dark:text-white">Page 1 - Couverture</h3>
              <p>
                Image du four à bois, logo Pizza Falchi, tagline &quot;Authentique Pizza
                Italienne&quot; et numéro de téléphone.
              </p>
              <p className="text-xs mt-1 opacity-70">
                Format: {BOOKLET_COVER_FRONT_DIMENSIONS.width}×
                {BOOKLET_COVER_FRONT_DIMENSIONS.height}px (A5)
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-900 dark:text-white">Pages 2-3 - Menu</h3>
              <p>
                Menu complet avec best-sellers, classiques, crèmes et spécialités. Pliure centrale
                pour format booklet.
              </p>
              <p className="text-xs mt-1 opacity-70">
                Format: {BOOKLET_MENU_SPREAD_DIMENSIONS.width}×
                {BOOKLET_MENU_SPREAD_DIMENSIONS.height}px (A4)
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-900 dark:text-white">Page 4 - Dos</h3>
              <p>
                QR code Google Maps, adresse, horaires, site web et bannière carte de fidélité.
              </p>
              <p className="text-xs mt-1 opacity-70">
                Format: {BOOKLET_COVER_FRONT_DIMENSIONS.width}×
                {BOOKLET_COVER_FRONT_DIMENSIONS.height}px (A5)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
