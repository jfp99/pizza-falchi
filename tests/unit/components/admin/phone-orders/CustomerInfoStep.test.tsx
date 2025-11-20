import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerInfoStep, { type CustomerInfo } from '@/components/admin/phone-orders/CustomerInfoStep';

describe('CustomerInfoStep', () => {
  const mockCustomerInfo: CustomerInfo = {
    customerName: '',
    phone: '',
    deliveryType: 'pickup',
    address: '',
    city: 'Puyricard',
    postalCode: '13540',
  };

  const mockOnChange = vi.fn();
  const mockOnDeliveryTypeChange = vi.fn();

  it('should render customer info form', () => {
    render(
      <CustomerInfoStep
        customerInfo={mockCustomerInfo}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
      />
    );

    expect(screen.getByLabelText(/nom du client/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument();
    expect(screen.getByText(/à emporter/i)).toBeInTheDocument();
    expect(screen.getByText(/livraison/i)).toBeInTheDocument();
  });

  it('should call onChange when customer name is updated', () => {
    render(
      <CustomerInfoStep
        customerInfo={mockCustomerInfo}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
      />
    );

    const nameInput = screen.getByLabelText(/nom du client/i);
    fireEvent.change(nameInput, { target: { value: 'Jean Dupont' } });

    expect(mockOnChange).toHaveBeenCalledWith('customerName', 'Jean Dupont');
  });

  it('should call onChange when phone is updated', () => {
    render(
      <CustomerInfoStep
        customerInfo={mockCustomerInfo}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
      />
    );

    const phoneInput = screen.getByLabelText(/téléphone/i);
    fireEvent.change(phoneInput, { target: { value: '06 12 34 56 78' } });

    expect(mockOnChange).toHaveBeenCalledWith('phone', '06 12 34 56 78');
  });

  it('should call onDeliveryTypeChange when delivery type is changed', () => {
    render(
      <CustomerInfoStep
        customerInfo={mockCustomerInfo}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
      />
    );

    const deliveryButton = screen.getByRole('radio', { name: /livraison/i });
    fireEvent.click(deliveryButton);

    expect(mockOnDeliveryTypeChange).toHaveBeenCalledWith('delivery');
  });

  it('should not show delivery address fields for pickup', () => {
    render(
      <CustomerInfoStep
        customerInfo={mockCustomerInfo}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
      />
    );

    expect(screen.queryByPlaceholderText(/123 rue de la pizza/i)).not.toBeInTheDocument();
  });

  it('should show delivery address fields when delivery is selected', () => {
    const deliveryCustomerInfo = {
      ...mockCustomerInfo,
      deliveryType: 'delivery' as const,
    };

    render(
      <CustomerInfoStep
        customerInfo={deliveryCustomerInfo}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
      />
    );

    expect(screen.getByPlaceholderText(/123 rue de la pizza/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ville/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/code postal/i)).toBeInTheDocument();
  });

  it('should display validation errors', () => {
    const errors = {
      customerName: 'Le nom est requis',
      phone: 'Numéro invalide',
    };

    render(
      <CustomerInfoStep
        customerInfo={mockCustomerInfo}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
        errors={errors}
      />
    );

    expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
    expect(screen.getByText('Numéro invalide')).toBeInTheDocument();
  });

  it('should apply error styling to inputs with errors', () => {
    const errors = {
      customerName: 'Le nom est requis',
    };

    render(
      <CustomerInfoStep
        customerInfo={mockCustomerInfo}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
        errors={errors}
      />
    );

    const nameInput = screen.getByLabelText(/nom du client/i);
    expect(nameInput).toHaveClass('border-red-500');
  });

  it('should have proper ARIA attributes', () => {
    render(
      <CustomerInfoStep
        customerInfo={mockCustomerInfo}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
      />
    );

    const nameInput = screen.getByLabelText(/nom du client/i);
    expect(nameInput).toHaveAttribute('aria-required', 'true');

    const pickupButton = screen.getByRole('radio', { name: /à emporter/i });
    expect(pickupButton).toHaveAttribute('aria-checked', 'true');
  });

  it('should limit postal code to 5 characters', () => {
    render(
      <CustomerInfoStep
        customerInfo={{ ...mockCustomerInfo, deliveryType: 'delivery' }}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
      />
    );

    const postalCodeInput = screen.getByPlaceholderText(/code postal/i);
    expect(postalCodeInput).toHaveAttribute('maxLength', '5');
  });

  it('should autofocus on customer name input', () => {
    render(
      <CustomerInfoStep
        customerInfo={mockCustomerInfo}
        onChange={mockOnChange}
        onDeliveryTypeChange={mockOnDeliveryTypeChange}
      />
    );

    const nameInput = screen.getByLabelText(/nom du client/i);
    expect(nameInput).toHaveFocus();
  });
});
