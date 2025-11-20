'use client';

import { memo } from 'react';
import { User, MapPin } from 'lucide-react';
import type { ChangeEvent } from 'react';

export interface CustomerInfo {
  customerName: string;
  phone: string;
  deliveryType: 'pickup' | 'delivery';
  address: string;
  city: string;
  postalCode: string;
}

interface CustomerInfoStepProps {
  customerInfo: CustomerInfo;
  onChange: (field: keyof CustomerInfo, value: string) => void;
  onDeliveryTypeChange: (type: 'pickup' | 'delivery') => void;
  errors?: Partial<Record<keyof CustomerInfo, string>>;
}

function CustomerInfoStep({
  customerInfo,
  onChange,
  onDeliveryTypeChange,
  errors = {},
}: CustomerInfoStepProps) {
  const handleInputChange = (field: keyof CustomerInfo) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    onChange(field, e.target.value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
        <User className="w-5 h-5 text-primary-red" aria-hidden="true" />
        Informations Client
      </h3>

      {/* Customer Name */}
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Nom du client <span className="text-primary-red">*</span>
        </label>
        <input
          id="customerName"
          type="text"
          value={customerInfo.customerName}
          onChange={handleInputChange('customerName')}
          placeholder="Jean Dupont"
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
            errors.customerName
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-primary-red'
          }`}
          autoFocus
          aria-required="true"
          aria-invalid={!!errors.customerName}
          aria-describedby={errors.customerName ? 'customerName-error' : undefined}
        />
        {errors.customerName && (
          <p
            id="customerName-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.customerName}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Téléphone <span className="text-primary-red">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={customerInfo.phone}
          onChange={handleInputChange('phone')}
          placeholder="+33 6 12 34 56 78"
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
            errors.phone
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-primary-red'
          }`}
          aria-required="true"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Delivery Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Type de service <span className="text-primary-red">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3" role="radiogroup">
          <button
            type="button"
            role="radio"
            aria-checked={customerInfo.deliveryType === 'pickup'}
            onClick={() => onDeliveryTypeChange('pickup')}
            className={`p-4 rounded-xl border-2 font-bold transition-all ${
              customerInfo.deliveryType === 'pickup'
                ? 'bg-primary-red text-white border-primary-red shadow-md'
                : 'bg-white text-charcoal border-gray-300 hover:border-primary-red'
            }`}
          >
            À Emporter
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={customerInfo.deliveryType === 'delivery'}
            onClick={() => onDeliveryTypeChange('delivery')}
            className={`p-4 rounded-xl border-2 font-bold transition-all ${
              customerInfo.deliveryType === 'delivery'
                ? 'bg-primary-red text-white border-primary-red shadow-md'
                : 'bg-white text-charcoal border-gray-300 hover:border-primary-red'
            }`}
          >
            Livraison
          </button>
        </div>
      </div>

      {/* Delivery Address (conditional) */}
      {customerInfo.deliveryType === 'delivery' && (
        <div
          className="space-y-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200"
          role="region"
          aria-label="Adresse de livraison"
        >
          <h4 className="font-bold text-charcoal flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" aria-hidden="true" />
            Adresse de livraison
          </h4>

          <div>
            <label htmlFor="address" className="sr-only">
              Adresse
            </label>
            <input
              id="address"
              type="text"
              value={customerInfo.address}
              onChange={handleInputChange('address')}
              placeholder="123 Rue de la Pizza"
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                errors.address
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-primary-red'
              }`}
              aria-required="true"
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? 'address-error' : undefined}
            />
            {errors.address && (
              <p id="address-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className="sr-only">
                Ville
              </label>
              <input
                id="city"
                type="text"
                value={customerInfo.city}
                onChange={handleInputChange('city')}
                placeholder="Ville"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                  errors.city
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-300 focus:border-primary-red'
                }`}
                aria-required="true"
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? 'city-error' : undefined}
              />
              {errors.city && (
                <p id="city-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className="sr-only">
                Code postal
              </label>
              <input
                id="postalCode"
                type="text"
                value={customerInfo.postalCode}
                onChange={handleInputChange('postalCode')}
                placeholder="Code postal"
                maxLength={5}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                  errors.postalCode
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-300 focus:border-primary-red'
                }`}
                aria-required="true"
                aria-invalid={!!errors.postalCode}
                aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
              />
              {errors.postalCode && (
                <p id="postalCode-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(CustomerInfoStep);
