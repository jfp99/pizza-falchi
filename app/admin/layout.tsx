'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, LogOut, Phone, Clock, Menu, X, FileImage } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin?callbackUrl=/admin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center transition-colors duration-300">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-red/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-red border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  const navItems = [
    { href: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
    { href: '/admin/products', icon: Package, label: 'Produits' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
    { href: '/admin/time-slots/dashboard', icon: Phone, label: 'Créneaux' },
    { href: '/admin/opening-hours', icon: Clock, label: 'Horaires' },
    { href: '/admin/customers', icon: Users, label: 'Clients' },
    { href: '/admin/flyer', icon: FileImage, label: 'Flyer' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Admin Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/admin"
              className="flex items-center space-x-3 group"
            >
              <div className="p-2 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-primary-red to-primary-red-dark bg-clip-text text-transparent">
                  Admin
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Pizza Falchi</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${active
                        ? 'bg-primary-red text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-red dark:hover:text-primary-red-light'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {session.user.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                aria-label="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${active
                        ? 'bg-primary-red text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-red dark:hover:text-primary-red-light'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile logout button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="py-8">{children}</main>
    </div>
  );
}
