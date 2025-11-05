import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AbandonedCart from '@/models/AbandonedCart';
import { sendAbandonedCartEmail } from '@/lib/email';

/**
 * Cron job endpoint to send abandoned cart reminder emails
 * Should be called by a cron service (e.g., Vercel Cron) every hour or daily
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'default-cron-secret';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Expire old carts first
    await AbandonedCart.expireOldCarts();

    // Get carts that need reminders (abandoned for 24 hours)
    const cartsToRemind = await AbandonedCart.getCartsForReminder(24);

    let sent = 0;
    let failed = 0;

    // Send reminder emails
    for (const cart of cartsToRemind) {
      try {
        const items = cart.items.map((item) => ({
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          price: item.price,
        }));

        const result = await sendAbandonedCartEmail({
          email: cart.email,
          customerName: cart.customerName,
          items,
          totalValue: cart.totalValue,
          cartUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pizzafalchi.com'}/cart`,
        });

        if (result.success) {
          // Mark cart as reminded
          await AbandonedCart.markAsReminded(String(cart._id));
          sent++;
        } else {
          failed++;
          console.error(`Failed to send reminder to ${cart.email}:`, result.error);
        }
      } catch (error) {
        failed++;
        console.error(`Error processing cart ${String(cart._id)}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${cartsToRemind.length} abandoned carts`,
      sent,
      failed,
    });
  } catch (error) {
    console.error('Abandoned cart reminder job error:', error);
    return NextResponse.json(
      { error: 'Failed to process abandoned cart reminders' },
      { status: 500 }
    );
  }
}

/**
 * Manual trigger endpoint (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin

    await connectDB();

    // Get carts that need reminders
    const cartsToRemind = await AbandonedCart.getCartsForReminder(24);

    let sent = 0;
    let failed = 0;

    // Send reminder emails
    for (const cart of cartsToRemind) {
      try {
        const items = cart.items.map((item) => ({
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          price: item.price,
        }));

        const result = await sendAbandonedCartEmail({
          email: cart.email,
          customerName: cart.customerName,
          items,
          totalValue: cart.totalValue,
          cartUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pizzafalchi.com'}/cart`,
        });

        if (result.success) {
          await AbandonedCart.markAsReminded(String(cart._id));
          sent++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        console.error(`Error processing cart:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Manually processed ${cartsToRemind.length} abandoned carts`,
      sent,
      failed,
    });
  } catch (error) {
    console.error('Manual abandoned cart reminder error:', error);
    return NextResponse.json(
      { error: 'Failed to send abandoned cart reminders' },
      { status: 500 }
    );
  }
}
