/**
 * Opening Hours API Routes
 * GET: Fetch all opening hours configuration
 * POST: Create or update opening hours for a day
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import OpeningHours from '@/models/OpeningHours';
import { validateCSRFMiddleware } from '@/lib/csrf';

/**
 * GET /api/opening-hours
 * Fetch all opening hours configuration
 * Query params:
 * - dayOfWeek: Filter by specific day (0-6)
 * - includeExceptions: Include exceptions in response (boolean, default: true)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const dayOfWeek = searchParams.get('dayOfWeek');
    const includeExceptions = searchParams.get('includeExceptions') !== 'false';

    // Query for specific day
    if (dayOfWeek !== null) {
      const day = parseInt(dayOfWeek);

      if (isNaN(day) || day < 0 || day > 6) {
        return NextResponse.json(
          { error: 'dayOfWeek must be between 0 and 6' },
          { status: 400 }
        );
      }

      const openingHours = await OpeningHours.getByDayOfWeek(day);

      if (!openingHours) {
        return NextResponse.json(
          { error: 'Opening hours not found for this day' },
          { status: 404 }
        );
      }

      // Remove exceptions if not requested
      if (!includeExceptions && openingHours.exceptions) {
        openingHours.exceptions = [];
      }

      return NextResponse.json({
        success: true,
        openingHours,
      });
    }

    // Get all opening hours
    const allOpeningHours = await OpeningHours.getAllWithExceptions();

    // Remove exceptions if not requested
    if (!includeExceptions) {
      allOpeningHours.forEach((oh) => {
        oh.exceptions = [];
      });
    }

    return NextResponse.json({
      success: true,
      openingHours: allOpeningHours,
      count: allOpeningHours.length,
    });
  } catch (error) {
    console.error('GET /api/opening-hours error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch opening hours',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/opening-hours
 * Create or update opening hours for a day
 * Body:
 * - dayOfWeek: Day of week (0-6)
 * - isOpen: Is pizzeria open on this day
 * - hours: { open: "HH:MM", close: "HH:MM" } (required if isOpen = true)
 * - slotDuration: Duration of each time slot in minutes (default: 10)
 * - ordersPerSlot: Number of orders per slot (default: 2)
 */
export async function POST(request: NextRequest) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json({ error: csrfValidation.error }, { status: 403 });
  }

  try {
    await connectDB();

    const body = await request.json();
    const { dayOfWeek, isOpen, hours, slotDuration = 10, ordersPerSlot = 2 } = body;

    if (dayOfWeek === undefined) {
      return NextResponse.json(
        { error: 'dayOfWeek is required' },
        { status: 400 }
      );
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json(
        { error: 'dayOfWeek must be between 0 and 6' },
        { status: 400 }
      );
    }

    if (isOpen === undefined) {
      return NextResponse.json(
        { error: 'isOpen is required' },
        { status: 400 }
      );
    }

    if (isOpen && !hours) {
      return NextResponse.json(
        { error: 'hours is required when isOpen is true' },
        { status: 400 }
      );
    }

    if (isOpen && hours) {
      if (!hours.open || !hours.close) {
        return NextResponse.json(
          { error: 'hours must include open and close times' },
          { status: 400 }
        );
      }

      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(hours.open) || !timeRegex.test(hours.close)) {
        return NextResponse.json(
          { error: 'Invalid time format (use HH:MM)' },
          { status: 400 }
        );
      }
    }

    // Check if opening hours already exist for this day
    const existing = await OpeningHours.findOne({ dayOfWeek });

    if (existing) {
      // Update existing
      existing.isOpen = isOpen;
      existing.hours = hours;
      existing.slotDuration = slotDuration;
      existing.ordersPerSlot = ordersPerSlot;

      await existing.save();

      return NextResponse.json({
        success: true,
        message: 'Opening hours updated successfully',
        openingHours: existing,
      });
    } else {
      // Create new
      const newOpeningHours = await OpeningHours.create({
        dayOfWeek,
        isOpen,
        hours,
        slotDuration,
        ordersPerSlot,
        exceptions: [],
      });

      return NextResponse.json({
        success: true,
        message: 'Opening hours created successfully',
        openingHours: newOpeningHours,
      }, { status: 201 });
    }
  } catch (error) {
    console.error('POST /api/opening-hours error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create/update opening hours',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
