import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import SkipLink from '@/components/layout/SkipLink';
import AuthProvider from '@/components/providers/SessionProvider';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/legal/CookieConsent';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Pizza Falchi - Pizzas Artisanales à Puyricard - France',
    template: '%s | Pizza Falchi'
  },
  description: 'Découvrez Pizza Falchi, votre food truck de pizzas artisanales à Puyricard. Pizzas au feu de bois préparées avec des ingrédients frais et de qualité. Commandez en ligne et savourez l\'authenticité provençale.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  keywords: [
    'pizza',
    'pizzeria',
    'food truck',
    'Puyricard',
    'Provence',
    'pizza artisanale',
    'pizza au feu de bois',
    'livraison pizza',
    'pizza provençale',
    'restaurant italien',
    'pizzas fraîches'
  ],
  authors: [{ name: 'Pizza Falchi' }],
  creator: 'Pizza Falchi',
  publisher: 'Pizza Falchi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.pizzafalchi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.pizzafalchi.com',
    siteName: 'Pizza Falchi',
    title: 'Pizza Falchi - Pizzas Artisanales à Puyricard',
    description: 'Découvrez nos pizzas artisanales au feu de bois préparées avec passion. Food truck moderne à Puyricard, Provence.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pizza Falchi - Pizzas Artisanales',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pizza Falchi - Pizzas Artisanales à Puyricard',
    description: 'Découvrez nos pizzas artisanales au feu de bois préparées avec passion. Food truck moderne à Puyricard, Provence.',
    images: ['/images/twitter-image.jpg'],
    creator: '@pizzafalchi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  let theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = 'light';
                  }
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <meta name="theme-color" content="#FFF9F0" />
      </head>
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <SkipLink />
              <div className="min-h-screen flex flex-col bg-warm-cream dark:bg-gray-900 transition-colors duration-300">
              <Navigation />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                },
              }}
            />
            <SpeedInsights />
            <GoogleAnalytics />
            <CookieConsent />
          </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}