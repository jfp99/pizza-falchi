import { describe, it, expect } from 'vitest';
import {
  phoneOrderCustomerSchema,
  deliveryAddressSchema,
  phoneOrderCustomerWithAddressSchema,
  orderItemSchema,
  completePhoneOrderSchema,
  normalizePhoneNumber,
  formatPhoneNumber,
} from '@/lib/validations/phoneOrder';

describe('phoneOrderCustomerSchema', () => {
  it('should validate valid customer data', () => {
    const validData = {
      customerName: 'Jean Dupont',
      phone: '06 12 34 56 78',
      deliveryType: 'pickup' as const,
    };

    const result = phoneOrderCustomerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject short names', () => {
    const invalidData = {
      customerName: 'J',
      phone: '06 12 34 56 78',
      deliveryType: 'pickup' as const,
    };

    const result = phoneOrderCustomerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept various French phone formats', () => {
    const validPhones = [
      '06 12 34 56 78',
      '0612345678',
      '+33 6 12 34 56 78',
      '+33612345678',
      '06.12.34.56.78',
      '06-12-34-56-78',
    ];

    validPhones.forEach((phone) => {
      const result = phoneOrderCustomerSchema.safeParse({
        customerName: 'Jean Dupont',
        phone,
        deliveryType: 'pickup',
      });
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid phone numbers', () => {
    const invalidPhones = [
      '123456',
      'abc',
      '06 12 34',
      '1234567890', // doesn't start with 0
    ];

    invalidPhones.forEach((phone) => {
      const result = phoneOrderCustomerSchema.safeParse({
        customerName: 'Jean Dupont',
        phone,
        deliveryType: 'pickup',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('deliveryAddressSchema', () => {
  it('should validate valid address', () => {
    const validAddress = {
      street: '123 Rue de la Pizza',
      city: 'Puyricard',
      postalCode: '13540',
    };

    const result = deliveryAddressSchema.safeParse(validAddress);
    expect(result.success).toBe(true);
  });

  it('should reject invalid postal codes', () => {
    const invalidCodes = ['1234', '123456', 'ABCDE', ''];

    invalidCodes.forEach((postalCode) => {
      const result = deliveryAddressSchema.safeParse({
        street: '123 Rue de la Pizza',
        city: 'Puyricard',
        postalCode,
      });
      expect(result.success).toBe(false);
    });
  });

  it('should reject too short addresses', () => {
    const result = deliveryAddressSchema.safeParse({
      street: '123',
      city: 'Puyricard',
      postalCode: '13540',
    });
    expect(result.success).toBe(false);
  });
});

describe('phoneOrderCustomerWithAddressSchema', () => {
  it('should validate pickup order without address', () => {
    const validData = {
      customerName: 'Jean Dupont',
      phone: '06 12 34 56 78',
      deliveryType: 'pickup' as const,
    };

    const result = phoneOrderCustomerWithAddressSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate delivery order with address', () => {
    const validData = {
      customerName: 'Jean Dupont',
      phone: '06 12 34 56 78',
      deliveryType: 'delivery' as const,
      address: {
        street: '123 Rue de la Pizza',
        city: 'Puyricard',
        postalCode: '13540',
      },
    };

    const result = phoneOrderCustomerWithAddressSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject delivery order without address', () => {
    const invalidData = {
      customerName: 'Jean Dupont',
      phone: '06 12 34 56 78',
      deliveryType: 'delivery' as const,
    };

    const result = phoneOrderCustomerWithAddressSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('orderItemSchema', () => {
  it('should validate valid order item', () => {
    const validItem = {
      productId: '507f1f77bcf86cd799439011',
      name: 'Margherita',
      quantity: 2,
      price: 12.5,
      category: 'pizza' as const,
    };

    const result = orderItemSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  it('should reject negative quantities', () => {
    const invalidItem = {
      productId: '507f1f77bcf86cd799439011',
      name: 'Margherita',
      quantity: -1,
      price: 12.5,
      category: 'pizza',
    };

    const result = orderItemSchema.safeParse(invalidItem);
    expect(result.success).toBe(false);
  });

  it('should reject excessive quantities', () => {
    const invalidItem = {
      productId: '507f1f77bcf86cd799439011',
      name: 'Margherita',
      quantity: 100,
      price: 12.5,
      category: 'pizza',
    };

    const result = orderItemSchema.safeParse(invalidItem);
    expect(result.success).toBe(false);
  });
});

describe('completePhoneOrderSchema', () => {
  it('should validate complete order', () => {
    const validOrder = {
      customer: {
        customerName: 'Jean Dupont',
        phone: '06 12 34 56 78',
        deliveryType: 'pickup' as const,
      },
      items: [
        {
          productId: '507f1f77bcf86cd799439011',
          name: 'Margherita',
          quantity: 2,
          price: 12.5,
          category: 'pizza' as const,
        },
      ],
      slotId: '507f1f77bcf86cd799439012',
      pizzaCount: 2,
    };

    const result = completePhoneOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('should reject order without items', () => {
    const invalidOrder = {
      customer: {
        customerName: 'Jean Dupont',
        phone: '06 12 34 56 78',
        deliveryType: 'pickup' as const,
      },
      items: [],
      slotId: '507f1f77bcf86cd799439012',
      pizzaCount: 0,
    };

    const result = completePhoneOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });
});

describe('normalizePhoneNumber', () => {
  it('should normalize various phone formats', () => {
    expect(normalizePhoneNumber('06 12 34 56 78')).toBe('0612345678');
    expect(normalizePhoneNumber('06.12.34.56.78')).toBe('0612345678');
    expect(normalizePhoneNumber('06-12-34-56-78')).toBe('0612345678');
    expect(normalizePhoneNumber('+33 6 12 34 56 78')).toBe('0612345678');
    expect(normalizePhoneNumber('+33612345678')).toBe('0612345678');
    expect(normalizePhoneNumber('0033612345678')).toBe('0612345678');
  });
});

describe('formatPhoneNumber', () => {
  it('should format phone number for display', () => {
    expect(formatPhoneNumber('0612345678')).toBe('06 12 34 56 78');
    expect(formatPhoneNumber('06 12 34 56 78')).toBe('06 12 34 56 78');
    expect(formatPhoneNumber('+33612345678')).toBe('06 12 34 56 78');
  });

  it('should return original for invalid length', () => {
    expect(formatPhoneNumber('123')).toBe('123');
    expect(formatPhoneNumber('12345678901234')).toBe('12345678901234');
  });
});
