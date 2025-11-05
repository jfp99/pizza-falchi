'use client';
import { ShoppingCart, Tag, Star } from 'lucide-react';

interface PackageItem {
  type: string;
  quantity: number;
  description: string;
}

interface Package {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  items: PackageItem[];
  icon: string;
  color: string;
  popular: boolean;
  badge?: string;
}

interface PackageCardProps {
  package: Package;
  onSelect: (pkg: Package) => void;
}

const colorStyles = {
  red: {
    gradient: 'from-primary-red to-soft-red',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-primary-red',
    badge: 'bg-primary-red',
  },
  yellow: {
    gradient: 'from-primary-yellow to-soft-yellow',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    badge: 'bg-primary-yellow',
  },
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    badge: 'bg-purple-500',
  },
  green: {
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
    badge: 'bg-green-500',
  },
  orange: {
    gradient: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    badge: 'bg-orange-500',
  },
  blue: {
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    badge: 'bg-blue-500',
  },
};

export default function PackageCard({ package: pkg, onSelect }: PackageCardProps) {
  const colors = colorStyles[pkg.color as keyof typeof colorStyles] || colorStyles.red;
  const savings = pkg.originalPrice - pkg.discountedPrice;

  return (
    <div className="group relative bg-surface dark:bg-surface rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-border dark:border-border hover:border-primary-yellow dark:hover:border-primary-yellow cursor-pointer overflow-hidden">
      {/* Popular Badge */}
      {pkg.popular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-yellow to-soft-yellow text-gray-800 dark:text-gray-900 px-3 sm:px-4 py-1 rounded-bl-xl sm:rounded-bl-2xl font-bold text-xs shadow-lg flex items-center gap-1 transition-colors duration-300">
          <Star size={12} className="fill-current" />
          <span>POPULAIRE</span>
        </div>
      )}

      {/* Discount Badge */}
      {pkg.badge && (
        <div className={`absolute top-3 sm:top-4 left-3 sm:left-4 ${colors.badge} text-white px-2 sm:px-3 py-1 rounded-full font-black text-xs sm:text-sm shadow-lg z-10 transition-colors duration-300`}>
          {pkg.badge}
        </div>
      )}

      {/* Icon */}
      <div className="inline-block bg-background-secondary dark:bg-background-tertiary border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 sm:mb-4 mt-3 sm:mt-4 transition-colors duration-300">
        <span className="text-xl sm:text-2xl">{pkg.icon}</span>
      </div>

      {/* Package Name */}
      <h3 className="text-xl sm:text-2xl font-black text-text-primary dark:text-text-primary mb-2 group-hover:text-primary-red dark:group-hover:text-primary-red transition-colors duration-300">
        {pkg.name}
      </h3>

      {/* Description */}
      <p className="text-text-secondary dark:text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed transition-colors duration-300">
        {pkg.description}
      </p>

      {/* Items List */}
      <div className="space-y-2 mb-4 sm:mb-5 bg-background-secondary dark:bg-background-tertiary rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
        {pkg.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-red flex-shrink-0"></div>
            <span className="font-semibold text-text-secondary dark:text-text-secondary transition-colors duration-300">
              {item.quantity}x
            </span>
            <span className="text-text-secondary dark:text-text-secondary transition-colors duration-300">{item.description}</span>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
          <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary-red to-soft-red bg-clip-text text-transparent">
            {pkg.discountedPrice.toFixed(2)}€
          </span>
          <span className="text-base sm:text-lg text-gray-400 dark:text-gray-500 line-through font-medium transition-colors duration-300">
            {pkg.originalPrice.toFixed(2)}€
          </span>
        </div>
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 transition-colors duration-300">
          <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-bold">
            Économisez {savings.toFixed(2)}€
          </span>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => onSelect(pkg)}
        className="w-full bg-gradient-to-r from-primary-red to-primary-yellow hover:shadow-xl text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
        aria-label={`Sélectionner le forfait ${pkg.name}`}
      >
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base">Choisir ce menu</span>
      </button>
    </div>
  );
}
