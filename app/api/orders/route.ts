import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Customer from '@/models/Customer';
import TimeSlot from '@/models/TimeSlot';
import { sendWhatsAppNotification } from '@/lib/whatsapp';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';
import { readLimiter, orderLimiter } from '@/lib/rateLimiter';
import { orderSchema } from '@/lib/validations/order';
import { validateCSRFMiddleware } from '@/lib/csrf';
import { sanitizeOrderData } from '@/lib/sanitize';
import { dispatchOrderCreated } from '@/lib/webhooks/dispatcher';
import { webhookEvents } from '@/lib/webhooks/events';
import mongoose from 'mongoose';
import { secureError, secureWarn, formatSecureLog } from '@/lib/logging';

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await readLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const timeSlot = searchParams.get('timeSlot');

    // Build query object based on provided parameters
    const query: any = {};
    if (status) query.status = status;
    if (timeSlot) query.timeSlot = timeSlot;

    // CRITICAL PERFORMANCE FIX:
    // 1. Use lean() to return plain objects instead of Mongoose documents (10x faster)
    // 2. Select only necessary fields to reduce payload size
    // 3. Populate only minimal product fields (not all fields)
    // 4. Limit to 50 orders instead of 100 (reduces from 300-500 queries to 150-250)
    const orders = await Order.find(query)
      .select('_id customerName email phone deliveryType deliveryAddress items subtotal total status paymentStatus paymentMethod notes estimatedDelivery timeSlot scheduledTime pickupTimeRange createdAt')
      .populate({
        path: 'items.product',
        select: '_id name price category image' // Only essential product fields
      })
      .populate({
        path: 'timeSlot',
        select: '_id date startTime endTime isAvailable' // Only essential timeslot fields
      })
      .sort({ createdAt: -1 })
      .limit(50) // Reduced from 100 to 50 for better performance
      .lean()
      .exec();

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    // SECURITY: Log ALL CSRF failures for monitoring
    const logLevel = process.env.NODE_ENV === 'development' ? 'WARN' : 'ERROR';
    console[logLevel.toLowerCase() as 'warn' | 'error'](
      `[${logLevel}] CSRF validation failed:`,
      {
        env: process.env.NODE_ENV,
        error: csrfValidation.error,
        url: request.url,
        method: request.method,
        userAgent: request.headers.get('user-agent'),
      }
    );

    if (process.env.NODE_ENV === 'development') {
      // DEVELOPMENT MODE: Allow request but log prominent warning
      // Rationale: Hot reload clears CSRF tokens, blocking would prevent development
      // TODO: Implement token persistence strategy for development if this becomes an issue
      console.warn('⚠️⚠️⚠️ CSRF BYPASS IN DEVELOPMENT MODE ⚠️⚠️⚠️');
      console.warn('   This request would be BLOCKED in production!');
      console.warn('   If you see this frequently, check your CSRF token handling.');
    } else {
      // PRODUCTION MODE: Strictly enforce CSRF protection
      return NextResponse.json(
        { error: csrfValidation.error },
        { status: 403 }
      );
    }
  }

  // Apply rate limiting for order creation
  const rateLimitResponse = await orderLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await connectDB();

    const body = await request.json();

    // Sanitize input to prevent XSS attacks
    const sanitizedBody = sanitizeOrderData(body);

    // Validate input with Zod
    const validationResult = orderSchema.safeParse(sanitizedBody);

    if (!validationResult.success) {
      // SECURITY FIX: Use secure logging to avoid exposing PII
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      secureError('Order validation failed:', fieldErrors);
      secureError('Received data (sanitized):', sanitizedBody);

      // Build user-friendly error message
      const errorMessages = Object.entries(fieldErrors)
        .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
        .join('; ');

      return NextResponse.json(
        {
          error: 'Données de commande invalides',
          message: errorMessages || 'Veuillez vérifier les informations saisies',
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Calculate pizza count from order items BEFORE creating customer
    // We need to fetch product categories to count pizzas
    const Product = (await import('@/models/Product')).default;
    const productIds = validatedData.items.map((item: any) => item.product);
    const productCategories = await Product.find({
      _id: { $in: productIds }
    }).select('_id category').lean().exec();
    const categoryMap = new Map(productCategories.map((p: any) => [p._id.toString(), p.category]));

    // Calculate pizza count for loyalty tracking
    let orderPizzaCount = 0;
    for (const item of validatedData.items) {
      const category = categoryMap.get(item.product.toString());
      if (category === 'pizza') {
        orderPizzaCount += item.quantity;
      }
    }

    // Find or create customer
    let customer = await Customer.findOne({ phone: validatedData.phone });

    if (!customer) {
      // Create new customer
      customer = await Customer.create({
        name: validatedData.customerName,
        email: validatedData.email || '',
        phone: validatedData.phone,
        address: validatedData.deliveryAddress || {},
        totalOrders: 1,
        totalSpent: validatedData.total,
        totalPizzas: orderPizzaCount,
        loyaltyPizzasRedeemed: 0,
        lastOrderDate: new Date(),
      });
    } else {
      // Update existing customer stats
      customer.totalOrders += 1;
      customer.totalSpent += validatedData.total;
      customer.totalPizzas = (customer.totalPizzas || 0) + orderPizzaCount;
      customer.lastOrderDate = new Date();

      // Update customer info if provided and different
      if (validatedData.customerName && validatedData.customerName !== customer.name) {
        customer.name = validatedData.customerName;
      }
      if (validatedData.email && validatedData.email !== customer.email) {
        customer.email = validatedData.email;
      }
      if (validatedData.deliveryAddress && validatedData.deliveryType === 'delivery') {
        customer.address = validatedData.deliveryAddress;
      }

      await customer.save();
    }

    // Calculate estimated delivery time (30-45 minutes from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setMinutes(
      estimatedDelivery.getMinutes() + (validatedData.deliveryType === 'delivery' ? 45 : 30)
    );

    // CRITICAL FIX: Use MongoDB transactions to prevent race conditions
    // This ensures that slot availability check and order creation are atomic
    const session = await mongoose.startSession();
    session.startTransaction();

    let order;
    try {
      // Create order within transaction
      const orderData = {
        customerName: validatedData.customerName,
        email: validatedData.email || '',
        phone: validatedData.phone,
        deliveryType: validatedData.deliveryType,
        deliveryAddress: validatedData.deliveryAddress,
        items: validatedData.items,
        subtotal: validatedData.subtotal,
        tax: validatedData.tax,
        deliveryFee: validatedData.deliveryFee,
        total: validatedData.total,
        paymentMethod: validatedData.paymentMethod,
        notes: validatedData.notes || '',
        estimatedDelivery,
        status: 'pending',
        paymentStatus: 'pending',
        // Time slot fields
        timeSlot: validatedData.timeSlot,
        scheduledTime: validatedData.scheduledTime,
        pickupTimeRange: validatedData.pickupTimeRange,
        assignedBy: validatedData.assignedBy || 'customer',
        isManualAssignment: validatedData.isManualAssignment || false,
      };

      // Create order (returns array when using session)
      const [createdOrder] = await Order.create([orderData], { session });
      order = createdOrder;

      // Add order to time slot if selected (within same transaction)
      if (validatedData.timeSlot) {
        // Find time slot with session lock
        const timeSlot = await TimeSlot.findById(validatedData.timeSlot).session(session);

        if (!timeSlot) {
          throw new Error('Time slot not found');
        }

        // Reuse orderPizzaCount calculated earlier (no need to re-fetch products)
        // Check if slot can accept the order (atomically)
        if (!timeSlot.canAcceptOrder(orderPizzaCount)) {
          throw new Error(
            `Time slot is full or cannot accept ${orderPizzaCount} pizza(s). ` +
            `Current: ${timeSlot.pizzaCount}/${timeSlot.capacity} pizzas.`
          );
        }

        // Add order with accurate pizza count
        await timeSlot.addOrder(order._id, orderPizzaCount);
      }

      // Commit transaction - all or nothing
      await session.commitTransaction();
    } catch (error) {
      // Rollback on any error
      await session.abortTransaction();
      console.error('Transaction failed, rolling back order creation:', error);

      // Return user-friendly error
      return NextResponse.json(
        {
          error: 'Failed to create order',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: validatedData.timeSlot ? 'Time slot may be full. Please select another time.' : undefined
        },
        { status: 400 }
      );
    } finally {
      // Always end session
      session.endSession();
    }

    // Populate product details and time slot (optimized with field selection)
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: 'items.product',
        select: '_id name price category image'
      })
      .populate({
        path: 'timeSlot',
        select: '_id date startTime endTime'
      })
      .lean()
      .exec() as any;

    // Emit order created webhook event
    try {
      if (populatedOrder) {
        await dispatchOrderCreated(populatedOrder);

        // Also emit via event system for any local listeners
        await webhookEvents.emitOrderCreated({
          orderId: populatedOrder._id.toString(),
          orderNumber: populatedOrder.orderId || populatedOrder._id.toString().slice(-6).toUpperCase(),
          customer: {
            name: populatedOrder.customerName,
            email: populatedOrder.email,
            phone: populatedOrder.phone,
            deliveryAddress: populatedOrder.deliveryAddress,
          },
          items: populatedOrder.items.map((item: any) => ({
            productId: item.product?._id?.toString() || item.productId,
            productName: item.product?.name || 'Produit',
            quantity: item.quantity,
            price: item.price,
            customizations: item.customizations?.notes,
            totalPrice: item.total || item.quantity * item.price,
          })),
          totalAmount: populatedOrder.total,
          deliveryType: populatedOrder.deliveryType,
          paymentMethod: populatedOrder.paymentMethod,
          paymentStatus: populatedOrder.paymentStatus,
        });
      }
    } catch (webhookError) {
      console.error('Webhook dispatch error:', webhookError);
      // Don't fail order creation if webhook fails
    }

    // Prepare email data for notifications
    const emailData = {
      orderId: populatedOrder.orderId || populatedOrder._id.toString().slice(-6).toUpperCase(),
      customerName: populatedOrder.customerName,
      customerEmail: populatedOrder.email,
      items: populatedOrder.items.map((item: any) => ({
        name: item.product?.name || 'Produit',
        quantity: item.quantity,
        price: item.price,
        customizations: item.customizations,
      })),
      subtotal: populatedOrder.subtotal,
      tax: populatedOrder.tax || 0,
      deliveryFee: populatedOrder.deliveryFee || 0,
      total: populatedOrder.total,
      deliveryType: populatedOrder.deliveryType,
      deliveryAddress: populatedOrder.deliveryAddress,
      paymentMethod: populatedOrder.paymentMethod,
      estimatedTime: populatedOrder.estimatedDelivery
        ? new Date(populatedOrder.estimatedDelivery).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        : undefined,
      pickupTimeRange: populatedOrder.pickupTimeRange,
      notes: populatedOrder.notes,
    };

    // Send notifications in parallel (non-blocking)
    // These are fire-and-forget operations that won't block the response
    const notificationPromises: Promise<any>[] = [];

    // 1. Email confirmation to customer (if email provided)
    if (populatedOrder.email) {
      notificationPromises.push(
        sendOrderConfirmationEmail(emailData)
          .then(result => {
            if (result.success) {
              console.log(`Order confirmation email sent to ${populatedOrder.email}`);
            } else {
              console.warn(`Failed to send order confirmation email: ${result.error}`);
            }
          })
          .catch(err => console.error('Email notification error:', err))
      );
    }

    // 2. Admin notification email
    notificationPromises.push(
      sendAdminNotificationEmail(emailData)
        .then(result => {
          if (result.success) {
            console.log('Admin notification email sent');
          } else {
            console.warn(`Failed to send admin notification email: ${result.error}`);
          }
        })
        .catch(err => console.error('Admin email notification error:', err))
    );

    // 3. WhatsApp notification to restaurant
    let whatsappUrl: string | null = null;
    notificationPromises.push(
      sendWhatsAppNotification({
        orderId: populatedOrder._id.toString().slice(-6).toUpperCase(),
        customerName: populatedOrder.customerName,
        phone: populatedOrder.phone,
        total: populatedOrder.total,
        items: populatedOrder.items.map((item: any) => ({
          name: item.product?.name || 'Produit',
          quantity: item.quantity,
          price: item.price
        })),
        deliveryType: populatedOrder.deliveryType,
        deliveryAddress: populatedOrder.deliveryAddress,
        paymentMethod: populatedOrder.paymentMethod
      })
        .then(url => {
          whatsappUrl = url;
          console.log('WhatsApp notification sent to restaurant');
        })
        .catch(err => console.error('WhatsApp notification error:', err))
    );

    // Wait for all notifications (with timeout to not delay response too much)
    try {
      await Promise.race([
        Promise.allSettled(notificationPromises),
        new Promise(resolve => setTimeout(resolve, 3000)) // 3 second timeout
      ]);
    } catch (notificationError) {
      console.error('Notification batch error:', notificationError);
      // Don't fail order creation if notifications fail
    }

    // Update order with notification status
    try {
      await Order.findByIdAndUpdate(order._id, {
        $set: {
          notificationSent: true,
          notificationSentAt: new Date(),
          'notificationChannels.email': !!populatedOrder.email,
          'notificationChannels.whatsapp': !!whatsappUrl,
        },
      });
    } catch (updateError) {
      console.error('Failed to update notification status:', updateError);
    }

    // Return the response
    return NextResponse.json({
      ...populatedOrder,
      whatsappNotificationUrl: whatsappUrl
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
