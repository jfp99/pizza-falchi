'use client';

import Image from 'next/image';
import { BOOKLET_COLORS, BOOKLET_TYPOGRAPHY } from '@/lib/flyer/bookletDimensions';
import { flyerContactInfo, flyerHeritage, flyerLocationData } from '@/lib/flyer/menuData';
import { Phone, Clock, Globe, MapPin, Gift, ChefHat, Heart } from 'lucide-react';

/**
 * BackPage - Page 4 (Back Cover)
 * Loyalty program, location, contact info
 * Optimized to fill maximum space
 */
export default function BackPage() {
  return (
    <div className="flex flex-col h-full justify-between">
      {/* Loyalty Program Banner - Larger and more prominent */}
      <section
        className="p-5 rounded-xl text-center"
        style={{
          background: `linear-gradient(135deg, ${BOOKLET_COLORS.primaryYellow} 0%, ${BOOKLET_COLORS.primaryYellowDark} 100%)`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift size={24} color={BOOKLET_COLORS.primaryRed} strokeWidth={2.5} />
          <span
            style={{
              fontSize: '14px',
              fontWeight: 800,
              color: BOOKLET_COLORS.textDark,
              letterSpacing: '0.12em',
            }}
          >
            OFFRE FIDELITE
          </span>
          <Gift size={24} color={BOOKLET_COLORS.primaryRed} strokeWidth={2.5} />
        </div>
        <p
          style={{
            fontSize: '28px',
            fontWeight: 900,
            color: BOOKLET_COLORS.primaryRed,
            lineHeight: 1.1,
          }}
        >
          10eme PIZZA
        </p>
        <p
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: BOOKLET_COLORS.textDark,
            lineHeight: 1.1,
            marginTop: '2px',
          }}
        >
          OFFERTE !
        </p>
        <p
          style={{
            fontSize: '12px',
            color: BOOKLET_COLORS.textBrown,
            marginTop: '8px',
            fontWeight: 500,
          }}
        >
          Demandez votre carte de fidelite
        </p>
      </section>

      {/* Location Section - Larger map and QR */}
      <section
        className="flex-1 p-4 rounded-xl my-2"
        style={{
          backgroundColor: BOOKLET_COLORS.white,
          border: `2px solid ${BOOKLET_COLORS.softYellow}`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={20} color={BOOKLET_COLORS.primaryRed} strokeWidth={2.5} />
          <span
            style={{
              fontSize: `${BOOKLET_TYPOGRAPHY.subHeader.size + 2}px`,
              fontWeight: BOOKLET_TYPOGRAPHY.subHeader.weight,
              color: BOOKLET_COLORS.textDark,
              letterSpacing: '0.05em',
            }}
          >
            NOUS TROUVER
          </span>
        </div>

        <div className="flex gap-4">
          {/* Map Image - Larger */}
          <div
            className="relative rounded-lg overflow-hidden flex-shrink-0"
            style={{
              width: '160px',
              height: '120px',
              border: `2px solid ${BOOKLET_COLORS.softYellow}`,
            }}
          >
            <Image
              src="/images/map/google-maps-pizza-falchi.png"
              alt="Localisation Pizza Falchi"
              fill
              className="object-cover"
            />
          </div>

          {/* QR Code & Address */}
          <div className="flex flex-col justify-between flex-1">
            {/* QR Code - Larger */}
            <div className="flex items-start gap-3">
              <div
                className="relative rounded-lg overflow-hidden flex-shrink-0"
                style={{
                  width: '80px',
                  height: '80px',
                  border: `3px solid ${BOOKLET_COLORS.primaryYellow}`,
                  padding: '3px',
                  backgroundColor: 'white',
                }}
              >
                <Image
                  src="/images/qr-code-google-maps.png"
                  alt="QR Code Google Maps"
                  fill
                  className="object-contain"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
              <div className="flex flex-col justify-center">
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: BOOKLET_COLORS.textDark,
                  }}
                >
                  Scannez pour
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: BOOKLET_COLORS.primaryRed,
                  }}
                >
                  l&apos;itineraire
                </p>
              </div>
            </div>

            {/* Address - Larger */}
            <div className="mt-2">
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: BOOKLET_COLORS.textDark,
                  lineHeight: 1.3,
                }}
              >
                {flyerContactInfo.address}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: BOOKLET_COLORS.textBrown,
                }}
              >
                {flyerContactInfo.city}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: BOOKLET_COLORS.textMuted,
                  marginTop: '4px',
                }}
              >
                {flyerLocationData.parking}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Phone Number - Very Prominent */}
      <section
        className="py-4 px-5 rounded-xl flex items-center justify-center gap-4"
        style={{
          backgroundColor: BOOKLET_COLORS.primaryRed,
          boxShadow: '0 4px 12px rgba(227,6,19,0.3)',
        }}
      >
        <Phone size={28} color="white" strokeWidth={2.5} />
        <div className="text-center">
          <p
            style={{
              fontSize: '26px',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '0.06em',
            }}
          >
            {flyerContactInfo.phone}
          </p>
          <p
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}
          >
            COMMANDE & RESERVATION
          </p>
        </div>
      </section>

      {/* Hours & Website - Larger */}
      <section className="flex gap-3 mt-2">
        {/* Hours */}
        <div
          className="flex-1 p-3 rounded-lg flex items-center gap-3"
          style={{
            backgroundColor: `${BOOKLET_COLORS.primaryYellow}20`,
            border: `1.5px solid ${BOOKLET_COLORS.primaryYellow}50`,
          }}
        >
          <Clock size={20} color={BOOKLET_COLORS.primaryYellowDark} strokeWidth={2.5} />
          <div>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: BOOKLET_COLORS.textDark,
              }}
            >
              {flyerContactInfo.hours}
            </p>
            <p
              style={{
                fontSize: '11px',
                color: BOOKLET_COLORS.primaryRed,
                fontWeight: 600,
              }}
            >
              {flyerContactInfo.closedDay}
            </p>
          </div>
        </div>

        {/* Website */}
        <div
          className="flex-1 p-3 rounded-lg flex items-center gap-3"
          style={{
            backgroundColor: `${BOOKLET_COLORS.primaryYellow}20`,
            border: `1.5px solid ${BOOKLET_COLORS.primaryYellow}50`,
          }}
        >
          <Globe size={20} color={BOOKLET_COLORS.primaryYellowDark} strokeWidth={2.5} />
          <div>
            <p
              style={{
                fontSize: '10px',
                color: BOOKLET_COLORS.textMuted,
              }}
            >
              Commandez en ligne
            </p>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: BOOKLET_COLORS.primaryRed,
              }}
            >
              {flyerContactInfo.website}
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Badges - More prominent */}
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${BOOKLET_COLORS.basilGreen}15` }}>
          <ChefHat size={16} color={BOOKLET_COLORS.basilGreen} strokeWidth={2.5} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: BOOKLET_COLORS.basilGreen,
              letterSpacing: '0.05em',
            }}
          >
            FAIT MAISON
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${BOOKLET_COLORS.softRed}20` }}>
          <Heart size={16} color={BOOKLET_COLORS.primaryRed} strokeWidth={2.5} fill={BOOKLET_COLORS.primaryRed} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: BOOKLET_COLORS.primaryRed,
              letterSpacing: '0.05em',
            }}
          >
            DEPUIS {flyerHeritage.since}
          </span>
        </div>
      </div>
    </div>
  );
}
