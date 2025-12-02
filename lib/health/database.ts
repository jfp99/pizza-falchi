/**
 * Database Health Check Utility
 * Checks database population and integrity for n8n workflows
 */

import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import TimeSlot from '@/models/TimeSlot';
import Customer from '@/models/Customer';

export interface ProductHealth {
  count: number;
  hasImages: boolean;
  categoriesPopulated: {
    pizza: number;
    boisson: number;
    dessert: number;
    accompagnement: number;
  };
  missingImages: string[];
  availableCount: number;
}

export interface TimeSlotHealth {
  count: number;
  futureSlots: number;
  todaySlots: number;
  availableSlots: number;
  nearCapacitySlots: number; // Slots > 80% full
}

export interface OrderHealth {
  todayCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedTodayCount: number;
  cancelledTodayCount: number;
  totalRevenueTodayEuros: number;
  avgOrderValueEuros: number;
}

export interface CustomerHealth {
  totalCount: number;
  newTodayCount: number;
  repeatCustomersCount: number;
}

export interface DatabaseHealthReport {
  timestamp: Date;
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  products: ProductHealth;
  timeSlots: TimeSlotHealth;
  orders: OrderHealth;
  customers: CustomerHealth;
  recommendations: string[];
}

/**
 * Check database health and return comprehensive report
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealthReport> {
  await connectDB();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check Products
  const products = await Product.find({}).lean() as any[];
  const productsByCategory = {
    pizza: products.filter((p: any) => p.category === 'pizza').length,
    boisson: products.filter((p: any) => p.category === 'boisson').length,
    dessert: products.filter((p: any) => p.category === 'dessert').length,
    accompagnement: products.filter((p: any) => p.category === 'accompagnement').length,
  };
  const productsWithImages = products.filter((p: any) => p.image && p.image.length > 0);
  const missingImages = products.filter((p: any) => !p.image || p.image.length === 0).map((p: any) => p.name);
  const availableProducts = products.filter((p: any) => p.isAvailable !== false);

  const productHealth: ProductHealth = {
    count: products.length,
    hasImages: missingImages.length === 0,
    categoriesPopulated: productsByCategory,
    missingImages,
    availableCount: availableProducts.length,
  };

  // Product issues
  if (products.length === 0) {
    issues.push('CRITICAL: No products in database');
  } else if (products.length < 10) {
    issues.push(`WARNING: Only ${products.length} products in database`);
    recommendations.push('Consider adding more products to the menu');
  }

  if (productsByCategory.pizza === 0) {
    issues.push('CRITICAL: No pizzas in database - primary product missing');
  }

  if (missingImages.length > 0) {
    issues.push(`WARNING: ${missingImages.length} products missing images`);
    recommendations.push(`Add images for: ${missingImages.slice(0, 5).join(', ')}${missingImages.length > 5 ? '...' : ''}`);
  }

  if (availableProducts.length === 0) {
    issues.push('CRITICAL: No available products - customers cannot order');
  }

  // Check Time Slots
  const timeSlots = await TimeSlot.find({}).lean() as any[];
  const futureSlots = timeSlots.filter((ts: any) => new Date(ts.date) >= todayStart);
  const todaySlots = timeSlots.filter((ts: any) => {
    const slotDate = new Date(ts.date);
    return slotDate >= todayStart && slotDate < todayEnd;
  });
  const availableSlots = futureSlots.filter((ts: any) => ts.isAvailable !== false);
  const nearCapacitySlots = futureSlots.filter((ts: any) => {
    const capacity = ts.capacity || 10;
    const pizzaCount = ts.pizzaCount || 0;
    return pizzaCount / capacity > 0.8;
  });

  const timeSlotHealth: TimeSlotHealth = {
    count: timeSlots.length,
    futureSlots: futureSlots.length,
    todaySlots: todaySlots.length,
    availableSlots: availableSlots.length,
    nearCapacitySlots: nearCapacitySlots.length,
  };

  // Time slot issues
  if (futureSlots.length === 0) {
    issues.push('WARNING: No future time slots available');
    recommendations.push('Generate time slots for upcoming days');
  } else if (futureSlots.length < 5) {
    issues.push(`WARNING: Only ${futureSlots.length} future time slots`);
    recommendations.push('Consider generating more time slots');
  }

  if (todaySlots.length === 0) {
    issues.push('WARNING: No time slots for today');
  }

  if (nearCapacitySlots.length > 0) {
    issues.push(`INFO: ${nearCapacitySlots.length} time slots near capacity (>80%)`);
  }

  // Check Orders
  const todayOrders = await Order.find({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  }).lean() as any[];

  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const inProgressOrders = await Order.countDocuments({
    status: { $in: ['confirmed', 'preparing', 'ready'] },
  });
  const completedTodayOrders = todayOrders.filter((o: any) => o.status === 'completed').length;
  const cancelledTodayOrders = todayOrders.filter((o: any) => o.status === 'cancelled').length;
  const totalRevenueToday = todayOrders
    .filter((o: any) => o.status !== 'cancelled')
    .reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const avgOrderValue = todayOrders.length > 0
    ? totalRevenueToday / todayOrders.filter((o: any) => o.status !== 'cancelled').length
    : 0;

  const orderHealth: OrderHealth = {
    todayCount: todayOrders.length,
    pendingCount: pendingOrders,
    inProgressCount: inProgressOrders,
    completedTodayCount: completedTodayOrders,
    cancelledTodayCount: cancelledTodayOrders,
    totalRevenueTodayEuros: Math.round(totalRevenueToday * 100) / 100,
    avgOrderValueEuros: Math.round(avgOrderValue * 100) / 100,
  };

  // Order issues
  if (pendingOrders > 10) {
    issues.push(`WARNING: ${pendingOrders} orders still pending - may need attention`);
    recommendations.push('Review pending orders and confirm or process them');
  }

  if (cancelledTodayOrders > todayOrders.length * 0.2 && todayOrders.length > 5) {
    issues.push(`WARNING: High cancellation rate today (${cancelledTodayOrders}/${todayOrders.length})`);
    recommendations.push('Investigate cancellation reasons');
  }

  // Check Customers
  const totalCustomers = await Customer.countDocuments();
  const newCustomersToday = await Customer.countDocuments({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  });
  const repeatCustomers = await Customer.countDocuments({ totalOrders: { $gt: 1 } });

  const customerHealth: CustomerHealth = {
    totalCount: totalCustomers,
    newTodayCount: newCustomersToday,
    repeatCustomersCount: repeatCustomers,
  };

  // Determine overall status
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';

  const criticalIssues = issues.filter(i => i.startsWith('CRITICAL'));
  const warningIssues = issues.filter(i => i.startsWith('WARNING'));

  if (criticalIssues.length > 0) {
    status = 'critical';
  } else if (warningIssues.length > 0) {
    status = 'warning';
  }

  return {
    timestamp: now,
    status,
    issues,
    products: productHealth,
    timeSlots: timeSlotHealth,
    orders: orderHealth,
    customers: customerHealth,
    recommendations,
  };
}

/**
 * Quick health check - just returns status
 */
export async function quickHealthCheck(): Promise<{
  status: 'healthy' | 'warning' | 'critical';
  productsOk: boolean;
  timeSlotsOk: boolean;
  databaseConnected: boolean;
}> {
  try {
    await connectDB();

    const productCount = await Product.countDocuments();
    const futureSlotCount = await TimeSlot.countDocuments({
      date: { $gte: new Date() },
    });

    return {
      status: productCount > 0 && futureSlotCount > 0 ? 'healthy' : 'warning',
      productsOk: productCount > 0,
      timeSlotsOk: futureSlotCount > 0,
      databaseConnected: true,
    };
  } catch (error) {
    return {
      status: 'critical',
      productsOk: false,
      timeSlotsOk: false,
      databaseConnected: false,
    };
  }
}

/**
 * Get daily statistics for n8n reporting
 */
export async function getDailyStats(date?: Date): Promise<{
  date: string;
  orders: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  revenue: {
    total: number;
    average: number;
  };
  customers: {
    new: number;
    returning: number;
  };
  topProducts: Array<{ name: string; quantity: number }>;
}> {
  await connectDB();

  const targetDate = date || new Date();
  const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  // Get orders for the day
  const orders = await Order.find({
    createdAt: { $gte: dayStart, $lt: dayEnd },
  }).populate('items.product').lean() as any[];

  const completedOrders = orders.filter((o: any) => o.status === 'completed');
  const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled');
  const pendingOrdersList = orders.filter((o: any) => o.status === 'pending');

  const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const avgRevenue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Count new vs returning customers
  const customerPhones = orders.map((o: any) => o.phone).filter(Boolean);
  const uniquePhones = [...new Set(customerPhones)] as string[];

  let newCustomers = 0;
  let returningCustomers = 0;

  for (const phone of uniquePhones) {
    const customer = await Customer.findOne({ phone }).lean() as any;
    if (customer && customer.totalOrders > 1) {
      returningCustomers++;
    } else {
      newCustomers++;
    }
  }

  // Get top products
  const productCounts: Record<string, { name: string; quantity: number }> = {};

  for (const order of orders) {
    if (order.status === 'cancelled') continue;

    for (const item of order.items as any[]) {
      const productName = item.product?.name || 'Unknown';
      if (!productCounts[productName]) {
        productCounts[productName] = { name: productName, quantity: 0 };
      }
      productCounts[productName].quantity += item.quantity;
    }
  }

  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    date: dayStart.toISOString().split('T')[0],
    orders: {
      total: orders.length,
      completed: completedOrders.length,
      cancelled: cancelledOrders.length,
      pending: pendingOrdersList.length,
    },
    revenue: {
      total: Math.round(totalRevenue * 100) / 100,
      average: Math.round(avgRevenue * 100) / 100,
    },
    customers: {
      new: newCustomers,
      returning: returningCustomers,
    },
    topProducts,
  };
}
