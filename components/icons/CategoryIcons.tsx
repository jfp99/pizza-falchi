/**
 * Category Icons - Black & White SVG Icons
 * Professional icons for category filters, navigation, and UI elements
 */

import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  'aria-label'?: string;
}

const defaultProps: Partial<IconProps> = {
  size: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// ============================================================================
// CATEGORY ICONS (for menu filters)
// ============================================================================

export const PizzaSliceIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 2L2 22l10-4 10 4L12 2z" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="9" r="1" fill="currentColor" />
    </svg>
  );
};

export const DrinkIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M7 2h10l1 5H6l1-5z" />
      <path d="M6 7h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z" />
      <path d="M10 2v5M14 2v5" />
      <path d="M10 12h4" />
      <circle cx="9" cy="15" r="0.5" fill="currentColor" />
      <circle cx="15" cy="15" r="0.5" fill="currentColor" />
    </svg>
  );
};

export const GiftBoxIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M20 12v10H4V12" />
      <path d="M22 7H2v5h20V7z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
};

export const DessertIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M7 13c0-3 2-5 5-5s5 2 5 5" />
      <path d="M12 22c-3 0-5-2-5-5V13h10v4c0 3-2 5-5 5z" />
      <circle cx="12" cy="5" r="3" />
      <path d="M12 8v5" />
      <circle cx="10" cy="16" r="0.5" fill="currentColor" />
      <circle cx="14" cy="16" r="0.5" fill="currentColor" />
    </svg>
  );
};

// ============================================================================
// STATUS & BADGE ICONS
// ============================================================================

export const FlameIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 2c1 3 4 5 4 9 0 3-2 5-4 5s-4-2-4-5c0-2 1-4 2-5-1 0-2 1-2 3 0 0-2-1-2-4 0-4 3-7 6-3z" />
      <path d="M12 16c-2 0-4 1-4 3a4 4 0 0 0 8 0c0-2-2-3-4-3z" />
    </svg>
  );
};

export const LeafIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
};

export const StarFilledIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      stroke="none"
      {...rest}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
};

export const NewBadgeIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 2l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1 3-7z" />
    </svg>
  );
};

// ============================================================================
// EMPTY STATE ICONS
// ============================================================================

export const EmptyCartIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      <path d="M1 1l22 22" />
    </svg>
  );
};

export const EmptyPlateIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <path d="M8 8l8 8M16 8l-8 8" />
    </svg>
  );
};

// ============================================================================
// TEAM / AVATAR ICONS
// ============================================================================

export const ChefIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6V13.87z" />
      <path d="M6 17h12" />
      <circle cx="12" cy="7" r="1" />
    </svg>
  );
};

export const TruckIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
};

export const UserCircleIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" />
    </svg>
  );
};

// ============================================================================
// ACTION ICONS
// ============================================================================

export const CheckCircleIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
};

export const AlertCircleIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
};

export const CheckIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
};

export const XCircleIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
};

// ============================================================================
// TRUST BADGE ICONS
// ============================================================================

export const ShieldCheckIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
};

export const AwardIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
};

export const BadgeIcon: React.FC<IconProps> = (props) => {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...defaultProps}
      {...rest}
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export {
  // Re-export from Lucide for convenience (if needed)
  // These can be imported from lucide-react directly
};
