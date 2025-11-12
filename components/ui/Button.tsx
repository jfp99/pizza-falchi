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

    const variants = {
      primary: 'bg-gradient-to-r from-primary-red to-soft-red text-white hover:from-primary-red-dark hover:to-primary-red hover:shadow-xl active:scale-95',
      secondary: 'border-2 border-charcoal dark:border-gray-300 bg-transparent hover:bg-charcoal dark:hover:bg-gray-100 hover:text-white dark:hover:text-charcoal text-charcoal dark:text-gray-100',
      ghost: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 hover:shadow-md',
      outline: 'border-2 border-primary-red dark:border-primary-red-light text-primary-red dark:text-primary-red-light hover:bg-primary-red hover:text-white dark:hover:text-white hover:shadow-lg',
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
