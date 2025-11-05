'use client';

import { Phone } from 'lucide-react';
import { interactionAnalytics } from '@/lib/analytics';

interface PhoneButtonProps {
  variant?: 'primary' | 'secondary' | 'link';
  location: string;
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
  phoneNumber?: string;
}

const PHONE_NUMBER = '+33442920308';
const PHONE_DISPLAY = '04 42 92 03 08';

/**
 * PhoneButton Component
 * Reusable button/link for calling the pizzeria with integrated analytics tracking
 */
export default function PhoneButton({
  variant = 'primary',
  location,
  showIcon = true,
  showText = true,
  className = '',
  phoneNumber = PHONE_NUMBER,
}: PhoneButtonProps) {
  const handleClick = () => {
    interactionAnalytics.phoneCall(location, phoneNumber);
  };

  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 rounded-xl';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-primary-red to-primary-yellow text-white hover:from-primary-yellow hover:to-primary-red hover:scale-105 shadow-lg hover:shadow-2xl px-6 py-3',
    secondary:
      'bg-white text-primary-red border-2 border-primary-red hover:bg-primary-red hover:text-white hover:scale-105 px-6 py-3',
    link: 'text-white hover:text-primary-yellow underline decoration-2 underline-offset-4',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <a
      href={`tel:${phoneNumber}`}
      onClick={handleClick}
      className={combinedClassName}
      aria-label="Appeler Pizza Falchi"
    >
      {showIcon && <Phone className="w-5 h-5" aria-hidden="true" />}
      {showText && <span>{PHONE_DISPLAY}</span>}
    </a>
  );
}
