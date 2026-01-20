import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...props }, ref) => {
    // S-tier compliant: 200ms transition duration
    const baseStyles = 'rounded-2xl font-bold transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red dark:focus-visible:ring-brand-gold focus-visible:ring-offset-2';

    // REFINED: Solid colors, no gradients, standardized interactions
    const variants = {
      primary: 'bg-brand-red text-white shadow-soft-md hover:bg-brand-red-hover hover:shadow-soft-lg active:scale-98',
      secondary: 'bg-brand-gold text-gray-900 shadow-soft-md hover:bg-brand-gold-hover hover:shadow-soft-lg active:scale-98',
      ghost: 'bg-background-secondary dark:bg-surface text-text-primary dark:text-text-primary hover:bg-background-tertiary dark:hover:bg-surface-elevated',
      outline: 'border-2 border-brand-red text-brand-red dark:text-brand-red bg-transparent hover:bg-brand-red hover:text-white active:scale-98',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-12 py-6 text-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
