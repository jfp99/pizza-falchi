export interface ProductSizeOption {
  priceModifier: number;
  label?: string;
  available?: boolean;
}

export interface ProductExtra {
  name: string;
  price: number;
}

export interface SizeOptions {
  medium: {
    available: boolean;
    priceModifier: number;
  };
  large: {
    available: boolean;
    priceModifier: number;
  };
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'pizza' | 'boisson' | 'dessert' | 'accompagnement';
  image: string;
  ingredients: string[];
  available: boolean;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  tags?: string[];
  sizeOptions?: SizeOptions;
  availableExtras?: ProductExtra[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizations?: {
    size?: 'medium' | 'large';
    extras?: string[];
    cut?: boolean;
    notes?: string;
  };
  calculatedPrice?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  customizations?: {
    size?: 'medium' | 'large';
    extras?: string[];
    cut?: boolean;
    notes?: string;
  };
  total: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id?: string;
  customer?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'cash' | 'online';
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: DeliveryAddress;
  phone: string;
  email?: string;
  customerName: string;
  notes?: string;
  estimatedDelivery?: Date;
  timeSlot?: string; // Reference to TimeSlot
  scheduledTime?: Date;
  pickupTimeRange?: string;
  assignedBy?: 'customer' | 'cashier' | 'system';
  isManualAssignment?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TimeRange {
  open: string; // Format: "HH:MM"
  close: string; // Format: "HH:MM"
}

export interface Exception {
  date: Date;
  isClosed: boolean;
  reason?: string;
  customHours?: TimeRange;
}

export interface TimeSlot {
  _id?: string;
  date: Date;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  capacity: number;
  currentOrders: number;
  pizzaCount?: number; // Total pizzas in this slot (critical for oven capacity)
  orders: string[]; // Array of Order IDs
  isAvailable: boolean;
  status: 'active' | 'full' | 'closed';
  timeRange?: string; // Virtual property
  remainingCapacity?: number; // Virtual property
  remainingPizzas?: number; // Virtual property (capacity - pizzaCount)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OpeningHours {
  _id?: string;
  dayOfWeek: number; // 0-6 (0 = Sunday, 6 = Saturday)
  isOpen: boolean;
  hours?: TimeRange;
  exceptions: Exception[];
  slotDuration: number; // Duration in minutes (default: 10)
  ordersPerSlot: number; // Orders per slot (default: 2)
  dayName?: string; // Virtual property
  hoursDisplay?: string; // Virtual property
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TimeSlotStatistics {
  totalSlots: number;
  availableSlots: number;
  fullSlots: number;
  totalOrders: number;
  averageOrdersPerSlot: number;
  utilizationRate: number;
}

export interface TimeSlotResponse {
  success: boolean;
  slots?: TimeSlot[];
  slot?: TimeSlot;
  count?: number;
  message?: string;
  error?: string;
}

// ============================================================================
// MENU SECTION TYPES (Menu Engineering - Option B Par Popularite)
// ============================================================================

export type MenuSectionId =
  | 'best-sellers'
  | 'classiques'
  | 'cremes'
  | 'specialites'
  | 'boissons';

export interface MenuSection {
  id: MenuSectionId;
  title: string;
  subtitle?: string;
  iconName: string;
  layout: 'hero' | 'grid' | 'compact';
  featured?: boolean;
}

export interface GroupedMenuProducts {
  bestSellers: Product[];
  classiques: Product[];
  cremes: Product[];
  specialites: Product[];
  boissons: Product[];
}

// ============================================================================
// FLYER TYPES
// ============================================================================

export interface FlyerProduct {
  name: string;
  price: number;
  description?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isBestSeller?: boolean;
}

export interface FlyerFormule {
  name: string;
  price: number;
  originalPrice: number;
  description: string;
}

export interface FlyerContactInfo {
  phone: string;
  address: string;
  city: string;
  website: string;
  hours: string;
  closedDay: string;
}

export interface FlyerHeritage {
  since: string;
  tagline: string;
  cooking: string;
  loyalty: string;
}