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
import SpecialOfferBanner from '@/components/promotions/SpecialOfferBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Pizza Falchi - Pizzas Artisanales à Ajaccio',
    template: '%s | Pizza Falchi'
  },
  description: 'Découvrez Pizza Falchi, votre food truck de pizzas artisanales à Ajaccio. Pizzas au feu de bois préparées avec des ingrédients frais et de qualité. Commandez en ligne et savourez l\'authenticité corse.',
  icons: {
    icon: '/images/logo-pizzafalchi.jpg',
    shortcut: '/images/logo-pizzafalchi.jpg',
    apple: '/images/logo-pizzafalchi.jpg',
  },
  keywords: [
    'pizza',
    'pizzeria',
    'food truck',
    'Ajaccio',
    'Corse',
    'pizza artisanale',
    'pizza au feu de bois',
    'livraison pizza',
    'pizza corse',
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
    title: 'Pizza Falchi - Pizzas Artisanales à Ajaccio',
    description: 'Découvrez nos pizzas artisanales au feu de bois préparées avec passion. Food truck moderne à Ajaccio, Corse.',
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
    title: 'Pizza Falchi - Pizzas Artisanales à Ajaccio',
    description: 'Découvrez nos pizzas artisanales au feu de bois préparées avec passion. Food truck moderne à Ajaccio, Corse.',
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
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <SkipLink />
              <div className="min-h-screen flex flex-col bg-warm-cream dark:bg-gray-900 transition-colors duration-300">
              <Navigation />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <SpecialOfferBanner />
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
          </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}