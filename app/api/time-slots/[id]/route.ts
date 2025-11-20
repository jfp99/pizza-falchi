/**
 * Time Slot by ID API Routes
 * GET: Fetch a specific time slot
 * PUT: Update time slot (assign/remove orders, change status)
 * DELETE: Delete a time slot
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';
import { assignOrderToSlot, removeOrderFromSlot } from '@/lib/timeSlots';
import { validateCSRFMiddleware } from '@/lib/csrf';

/**
 * GET /api/time-slots/[id]
 * Fetch a specific time slot by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const slot = await TimeSlot.findById(id).populate('orders');

    if (!slot) {
      return NextResponse.json(
        { error: 'Time slot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      slot,
    });
  } catch (error) {
    console.error(`GET /api/time-slots/[id] error:`, error);
    return NextResponse.json(
      {
        error: 'Failed to fetch time slot',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/time-slots/[id]
 * Update a time slot
 * Body:
 * - action: 'addOrder' | 'removeOrder' | 'updateStatus'
 * - orderId: Order ID (for addOrder/removeOrder)
 * - status: New status (for updateStatus)
 */
export async function PUT(
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

    const body = await request.json();
    const { action, orderId, status } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'action is required' },
        { status: 400 }
      );
    }

    const slot = await TimeSlot.findById(id);

    if (!slot) {
      return NextResponse.json(
        { error: 'Time slot not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'addOrder':
        if (!orderId) {
          return NextResponse.json(
            { error: 'orderId is required for addOrder action' },
            { status: 400 }
          );
        }

        // Default to 1 pizza per order if not specified
        await slot.addOrder(orderId, 1);

        return NextResponse.json({
          success: true,
          message: 'Order added to time slot',
          slot: await TimeSlot.findById(id).populate('orders'),
        });

      case 'removeOrder':
        if (!orderId) {
          return NextResponse.json(
            { error: 'orderId is required for removeOrder action' },
            { status: 400 }
          );
        }

        // Default to 1 pizza per order if not specified
        await slot.removeOrder(orderId, 1);

        return NextResponse.json({
          success: true,
          message: 'Order removed from time slot',
          slot: await TimeSlot.findById(id).populate('orders'),
        });

      case 'updateStatus':
        if (!status) {
          return NextResponse.json(
            { error: 'status is required for updateStatus action' },
            { status: 400 }
          );
        }

        if (!['active', 'full', 'closed'].includes(status)) {
          return NextResponse.json(
            { error: 'Invalid status value' },
            { status: 400 }
          );
        }

        slot.status = status;
        await slot.save();

        return NextResponse.json({
          success: true,
          message: 'Time slot status updated',
          slot: await TimeSlot.findById(id).populate('orders'),
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(`PUT /api/time-slots/[id] error:`, error);
    return NextResponse.json(
      {
        error: 'Failed to update time slot',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/time-slots/[id]
 * Delete a time slot
 */
export async function DELETE(
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

    const slot = await TimeSlot.findById(id);

    if (!slot) {
      return NextResponse.json(
        { error: 'Time slot not found' },
        { status: 404 }
      );
    }

    // Check if slot has orders
    if (slot.orders && slot.orders.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete time slot with assigned orders',
          ordersCount: slot.orders.length,
        },
        { status: 400 }
      );
    }

    await TimeSlot.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Time slot deleted successfully',
    });
  } catch (error) {
    console.error(`DELETE /api/time-slots/[id] error:`, error);
    return NextResponse.json(
      {
        error: 'Failed to delete time slot',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
