import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', hoverable = false, children, className = '', ...props }, ref) => {
    // REFINED: 200ms transition, warm soft shadows
    const baseStyles = 'rounded-2xl transition-all duration-200';

    const variants = {
      default: 'bg-surface dark:bg-surface shadow-soft-md border border-border dark:border-border',
      elevated: 'bg-surface dark:bg-surface shadow-soft-lg border border-border dark:border-border',
      glass: 'bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20',
    };

    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // REFINED: Standardized hover - translate-y-1 (4px), scale 1.02, card-hover shadow
    const hoverStyles = hoverable ? 'hover:shadow-card-hover hover:-translate-y-1 hover:scale-102 active:scale-98 cursor-pointer' : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
