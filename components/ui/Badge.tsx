import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'popular' | 'spicy' | 'vegetarian' | 'star' | 'default';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', children, icon, className = '', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1 font-bold rounded-full transition-all duration-200';

    // REFINED: Solid colors, no gradients, warm shadows
    const variants = {
      success: 'bg-brand-green-lighter dark:bg-brand-green/20 text-brand-green dark:text-brand-green-light border border-brand-green/20',
      warning: 'bg-brand-gold-lighter dark:bg-brand-gold/20 text-brand-gold-hover dark:text-brand-gold border border-brand-gold/20',
      error: 'bg-brand-red-lighter dark:bg-brand-red/20 text-brand-red dark:text-brand-red-light border border-brand-red/20',
      info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
      popular: 'bg-brand-gold text-gray-900 shadow-soft-sm',  // SOLID gold, no gradient
      spicy: 'bg-brand-red text-white shadow-soft-sm',
      vegetarian: 'bg-basil-green text-white shadow-soft-sm',
      star: 'bg-[#D4AF37] text-[#1A1410] shadow-[0_0_12px_rgba(212,175,55,0.4)]',  // Golden star for best-sellers
      default: 'bg-background-tertiary dark:bg-surface text-text-secondary dark:text-text-secondary border border-border',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm',
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
