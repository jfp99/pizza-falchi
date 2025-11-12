'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function CookieConsent() {
  useEffect(() => {
    // Initialize tarteaucitron when component mounts and script is loaded
    if (typeof window !== 'undefined' && (window as any).tarteaucitron) {
      initTarteaucitron();
    }
  }, []);

  const initTarteaucitron = () => {
    const tarteaucitron = (window as any).tarteaucitron;

    tarteaucitron.init({
      // Privacy policy URL
      "privacyUrl": "/politique-confidentialite",

      // Cookie policy URL
      "bodyPosition": "bottom",

      // Hash to manage the cookie consent (if you want to use the same consent on several websites)
      "hashtag": "#tarteaucitron",

      // Cookie name
      "cookieName": "tarteaucitron",

      // Banner position (top/bottom)
      "orientation": "bottom",

      // Group services by category
      "groupServices": true,

      // Show the small banner
      "showAlertSmall": true,

      // Show the deny all button
      "cookieslist": true,

      // Show the close X button
      "closePopup": false,

      // Show cookie list
      "showIcon": true,

      // Position of the icon (BottomRight, BottomLeft, TopRight, TopLeft)
      "iconPosition": "BottomRight",

      // Show the accept all button when highPrivacy is disabled
      "adblocker": false,

      // Show a deny all button when highPrivacy is disabled
      "DenyAllCta": true,

      // Show an accept all button when highPrivacy is disabled
      "AcceptAllCta": true,

      // High privacy mode (requires user to accept each service)
      "highPrivacy": true,

      // Time before auto-accepting services in milliseconds (0 = disabled)
      "handleBrowserDNTRequest": false,

      // Remove credit link
      "removeCredit": false,

      // Show more info link
      "moreInfoLink": true,

      // Use external CSS
      "useExternalCss": false,

      // Use external JS
      "useExternalJs": false,

      // Read more link (can be your own page)
      "readmoreLink": "/politique-cookies",

      // Mandatory
      "mandatory": true,

      // Language (fr, en, de, es, it, pt, nl, ru, pl, cs, ro, hu)
      "lang": "fr",
    });

    // Google Analytics (only if GA_MEASUREMENT_ID is set)
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      (tarteaucitron.user = {
        gtagUa: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        gtagMore: function () { /* add here your optionnal gtag() */ }
      }),
      tarteaucitron.user.gtagUa = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      tarteaucitron.user.gtagMore = function () { /* add here your optionnal gtag() */ };

      (window as any).tarteaucitronForceLanguage = 'fr';

      (window as any).tarteaucitron.user.gtag = {
        "key": process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        "uri": "https://www.googletagmanager.com/gtag/js",
        "name": "Google Analytics (GA4)",
        "type": "analytic",
        "js": function () {
          "use strict";
          window.dataLayer = window.dataLayer || [];
          function gtag(...args: any[]) {
            window.dataLayer.push(args);
          }
          gtag('js', new Date());
          gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
        }
      };
    }
  };

  return (
    <>
      {/* Load Tarteaucitron.js from CDN */}
      <Script
        id="tarteaucitron-js"
        src="https://cdn.jsdelivr.net/gh/AmauriC/tarteaucitron.js@1.16.3/tarteaucitron.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          initTarteaucitron();
        }}
      />

      {/* Custom CSS for Pizza Falchi branding */}
      <style jsx global>{`
        #tarteaucitronRoot #tarteaucitronAlertBig,
        #tarteaucitronRoot #tarteaucitronAlertSmall {
          background-color: #FFF9F0 !important;
          border-top: 3px solid #E30613 !important;
        }

        #tarteaucitronRoot .tarteaucitronAllow {
          background-color: #E30613 !important;
          color: white !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
        }

        #tarteaucitronRoot .tarteaucitronDeny {
          background-color: #6B7280 !important;
          color: white !important;
          border-radius: 8px !important;
        }

        #tarteaucitronRoot .tarteaucitronAllow:hover {
          background-color: #C10511 !important;
        }

        #tarteaucitronRoot .tarteaucitconIcon {
          background-color: #E30613 !important;
        }

        #tarteaucitronRoot button {
          font-family: inherit !important;
        }

        #tarteaucitronRoot #tarteaucitronClosePanel {
          background-color: #E30613 !important;
        }

        /* Dark mode support */
        html.dark #tarteaucitronRoot #tarteaucitronAlertBig,
        html.dark #tarteaucitronRoot #tarteaucitronAlertSmall {
          background-color: #1F2937 !important;
          color: #F3F4F6 !important;
        }

        html.dark #tarteaucitronRoot #tarteaucitronServices .tarteaucitronTitle {
          color: #F3F4F6 !important;
        }

        html.dark #tarteaucitronRoot #tarteaucitronServices .tarteaucitronDetails {
          color: #D1D5DB !important;
        }
      `}</style>
    </>
  );
}
