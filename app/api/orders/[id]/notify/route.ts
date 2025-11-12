import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendOrderReadyNotification } from '@/lib/whatsapp';
import { validateCSRFMiddleware } from '@/lib/csrf';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json({ error: csrfValidation.error }, { status: 403 });
  }

  try {
    await connectDB();

    const { id } = await params;
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    // Send WhatsApp notification
    const result = await sendOrderReadyNotification({
      orderId: order.orderId,
      customerName: order.customerName,
      customerPhone: order.phone,
      deliveryType: order.deliveryType,
    });

    if (result.success) {
      // Update order to mark notification as sent
      order.notificationSent = true;
      order.notificationSentAt = new Date();
      await order.save();

      return NextResponse.json({
        success: true,
        message: 'Notification envoyée avec succès',
        messageSid: result.messageSid,
      });
    } else {
      return NextResponse.json(
        { error: 'Échec de l\'envoi de la notification', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi de la notification' },
      { status: 500 }
    );
  }
}
