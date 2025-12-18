/**
 * Flyer Preview Page - Pizza Falchi
 * Route: /flyer
 * Preview and export flyer in A4 landscape format
 */

'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PizzaFalchiFlyerA4 } from '@/components/flyer';
import {
  exportFlyerA4ToPDF,
  exportFlyerA4ToPNG,
} from '@/lib/flyer/exportUtils';

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

function FoldIcon({ size = 16 }: { size?: number }) {
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
      <path d="M12 3v18" />
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
    </svg>
  );
}

export default function FlyerPage() {
  const flyerRef = useRef<HTMLDivElement>(null);

  const [showFoldLine, setShowFoldLine] = useState(true);
  const [scale, setScale] = useState(0.75);
  const [isExporting, setIsExporting] = useState(false);

  const scaleOptions = [0.4, 0.5, 0.65, 0.75, 0.9];

  // Export handlers
  const handleExport = async (fileFormat: 'pdf' | 'png', quality: ExportQuality) => {
    if (!flyerRef.current) return;

    setIsExporting(true);
    const toastId = toast.loading('Export en cours...');

    try {
      let result;
      if (fileFormat === 'pdf') {
        result = await exportFlyerA4ToPDF(flyerRef.current, { quality });
      } else {
        result = await exportFlyerA4ToPNG(flyerRef.current, { quality });
      }

      if (result.success) {
        toast.success(`Fichier ${result.filename} telecharge!`, { id: toastId });
      } else {
        toast.error(`Erreur: ${result.error}`, { id: toastId });
      }
    } catch {
      toast.error('Erreur lors de l\'export', { id: toastId });
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
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium mb-4 transition-colors hover:opacity-70"
            style={{ color: '#4A3F35' }}
          >
            <ArrowLeftIcon size={18} />
            <span>Retour au tableau de bord</span>
          </Link>

          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: '#1A1410' }}
          >
            Flyer Pizza Falchi
          </h1>
          <p style={{ color: '#4A3F35' }}>
            Format A4 Paysage (297mm x 210mm) - Pliable en deux
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
                Exporter le flyer
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleExport('pdf', 'print')}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                  style={{
                    backgroundColor: '#C41E1A',
                    color: '#FFFFFF',
                  }}
                >
                  <DownloadIcon size={16} />
                  PDF (Impression)
                </button>
                <button
                  onClick={() => handleExport('png', 'print')}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                  style={{
                    backgroundColor: '#D4A84B',
                    color: '#FFFFFF',
                  }}
                >
                  <DownloadIcon size={16} />
                  PNG (Web)
                </button>
              </div>
            </div>

            {/* Preview Options */}
            <div className="flex flex-col gap-4">
              {/* Fold Line Toggle */}
              <div>
                <h2
                  className="text-sm font-semibold uppercase tracking-wide mb-2"
                  style={{ color: '#C41E1A' }}
                >
                  Options apercu
                </h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFoldLine}
                    onChange={(e) => setShowFoldLine(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                    style={{ accentColor: '#C41E1A' }}
                  />
                  <FoldIcon size={16} />
                  <span className="text-sm" style={{ color: '#4A3F35' }}>
                    Afficher ligne de pliure
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
          </div>
        </section>

        {/* Flyer Preview */}
        <section>
          <h2
            className="text-sm font-semibold uppercase tracking-wide mb-4"
            style={{ color: '#C41E1A' }}
          >
            Apercu du flyer A4 Paysage
          </h2>

          {/* Flyer Container */}
          <div
            className="flex justify-center p-8 rounded-xl overflow-auto"
            style={{ backgroundColor: '#E6DED0' }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
              }}
            >
              <PizzaFalchiFlyerA4
                ref={flyerRef}
                showFoldLine={showFoldLine}
                className="shadow-2xl"
              />
            </div>
          </div>

          {/* Format Info */}
          <div
            className="mt-4 p-4 rounded-lg text-sm"
            style={{ backgroundColor: '#FDF9F0', color: '#4A3F35' }}
          >
            <p className="font-medium mb-1" style={{ color: '#1A1410' }}>
              Specifications du flyer A4 Paysage:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Format: A4 Paysage (297mm x 210mm)</li>
              <li>Pliage: Se plie en deux pour former un A5 recto-verso</li>
              <li>Panneau gauche: Menu complet (visible deplie)</li>
              <li>Panneau droit: Couverture + Localisation (face avant plie)</li>
              <li>Resolution PDF: 300 DPI (qualite impression professionnelle)</li>
              <li>Couleurs: CMJN compatible (palette optimisee)</li>
            </ul>
          </div>
        </section>

        {/* Usage Tips */}
        <section
          className="mt-8 p-6 rounded-xl"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6DED0' }}
        >
          <h2
            className="text-sm font-semibold uppercase tracking-wide mb-3"
            style={{ color: '#C41E1A' }}
          >
            Conseils utilisation
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ color: '#4A3F35' }}>
            <div>
              <h3 className="font-medium mb-1" style={{ color: '#1A1410' }}>
                Pour impression
              </h3>
              <p>
                Utilisez le format PDF pour une impression professionnelle.
                Imprimez en recto seul puis pliez au milieu.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1" style={{ color: '#1A1410' }}>
                Pour web/reseaux sociaux
              </h3>
              <p>
                Utilisez le format PNG pour le partage en ligne.
                La haute resolution garantit une qualite optimale sur tous les ecrans.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
