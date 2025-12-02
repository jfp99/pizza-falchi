/**
 * Database Health Check API Endpoint
 * Used by n8n workflows to monitor database state
 *
 * GET /api/health/database - Full health report
 * GET /api/health/database?quick=true - Quick status check
 * GET /api/health/database?stats=true&date=YYYY-MM-DD - Daily statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkDatabaseHealth,
  quickHealthCheck,
  getDailyStats,
  DatabaseHealthReport,
} from '@/lib/health/database';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const quick = searchParams.get('quick') === 'true';
    const stats = searchParams.get('stats') === 'true';
    const dateParam = searchParams.get('date');

    // Quick health check
    if (quick) {
      const health = await quickHealthCheck();
      return NextResponse.json({
        success: true,
        ...health,
        timestamp: new Date().toISOString(),
      });
    }

    // Daily statistics
    if (stats) {
      const date = dateParam ? new Date(dateParam) : new Date();
      const dailyStats = await getDailyStats(date);
      return NextResponse.json({
        success: true,
        ...dailyStats,
      });
    }

    // Full health report
    const healthReport: DatabaseHealthReport = await checkDatabaseHealth();

    // Set appropriate HTTP status based on health status
    const httpStatus = healthReport.status === 'critical' ? 503 : 200;

    return NextResponse.json(
      {
        success: healthReport.status !== 'critical',
        ...healthReport,
      },
      { status: httpStatus }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        success: false,
        status: 'critical',
        error: error instanceof Error ? error.message : 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/health/database
 * Trigger database maintenance tasks (for n8n workflows)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'generate_report':
        const healthReport = await checkDatabaseHealth();
        return NextResponse.json({
          success: true,
          message: 'Health report generated',
          report: healthReport,
        });

      case 'daily_stats':
        const date = body.date ? new Date(body.date) : new Date();
        const dailyStats = await getDailyStats(date);
        return NextResponse.json({
          success: true,
          message: 'Daily stats generated',
          stats: dailyStats,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`,
            supportedActions: ['generate_report', 'daily_stats'],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Health action error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Action failed',
      },
      { status: 500 }
    );
  }
}
