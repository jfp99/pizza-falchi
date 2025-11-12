/**
 * Opening Hours Exceptions API Routes
 * POST: Add an exception for a specific date
 * DELETE: Remove an exception for a specific date
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import OpeningHours from '@/models/OpeningHours';
import { validateCSRFMiddleware } from '@/lib/csrf';

/**
 * POST /api/opening-hours/exceptions
 * Add an exception for a specific date
 * Body:
 * - date: Date for the exception (ISO format)
 * - isClosed: Is pizzeria closed on this date (boolean)
 * - reason: Reason for the exception (optional)
 * - customHours: Custom hours { open: "HH:MM", close: "HH:MM" } (optional if isClosed = false)
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
    const { date, isClosed, reason, customHours } = body;

    if (!date) {
      return NextResponse.json(
        { error: 'date is required' },
        { status: 400 }
      );
    }

    if (isClosed === undefined) {
      return NextResponse.json(
        { error: 'isClosed is required' },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // If not closed and has custom hours, validate them
    if (!isClosed && customHours) {
      if (!customHours.open || !customHours.close) {
        return NextResponse.json(
          { error: 'customHours must include open and close times' },
          { status: 400 }
        );
      }

      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(customHours.open) || !timeRegex.test(customHours.close)) {
        return NextResponse.json(
          { error: 'Invalid time format in customHours (use HH:MM)' },
          { status: 400 }
        );
      }
    }

    // Get the day of week for this date
    const dayOfWeek = targetDate.getDay();

    // Get opening hours for this day
    let openingHours = await OpeningHours.getByDayOfWeek(dayOfWeek);

    if (!openingHours) {
      return NextResponse.json(
        { error: 'Opening hours not configured for this day of week' },
        { status: 400 }
      );
    }

    // Add the exception
    await openingHours.addException({
      date: targetDate,
      isClosed,
      reason,
      customHours,
    });

    return NextResponse.json({
      success: true,
      message: 'Exception added successfully',
      openingHours,
    });
  } catch (error) {
    console.error('POST /api/opening-hours/exceptions error:', error);
    return NextResponse.json(
      {
        error: 'Failed to add exception',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/opening-hours/exceptions
 * Remove an exception for a specific date
 * Query params:
 * - date: Date of the exception to remove (ISO format)
 */
export async function DELETE(request: NextRequest) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json({ error: csrfValidation.error }, { status: 403 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'date query parameter is required' },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Get the day of week for this date
    const dayOfWeek = targetDate.getDay();

    // Get opening hours for this day
    const openingHours = await OpeningHours.getByDayOfWeek(dayOfWeek);

    if (!openingHours) {
      return NextResponse.json(
        { error: 'Opening hours not found for this day of week' },
        { status: 404 }
      );
    }

    // Remove the exception
    await openingHours.removeException(targetDate);

    return NextResponse.json({
      success: true,
      message: 'Exception removed successfully',
      openingHours,
    });
  } catch (error) {
    console.error('DELETE /api/opening-hours/exceptions error:', error);
    return NextResponse.json(
      {
        error: 'Failed to remove exception',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
